import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";
import { deflateRawSync } from "zlib";

export interface FolderFileInfo {
  id: string;
  fileName: string;
  fileUrl: string;
  folderPath: string;
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crc32Table: number[] = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function writeUInt16LE(buf: Buffer, value: number, offset: number) {
  buf[offset] = value & 0xff;
  buf[offset + 1] = (value >> 8) & 0xff;
}

function writeUInt32LE(buf: Buffer, value: number, offset: number) {
  buf[offset] = value & 0xff;
  buf[offset + 1] = (value >> 8) & 0xff;
  buf[offset + 2] = (value >> 16) & 0xff;
  buf[offset + 3] = (value >> 24) & 0xff;
}

function encodeUtf8(str: string): Buffer {
  return Buffer.from(str, "utf-8");
}

interface ZipEntry {
  path: string;
  data: Buffer;
  compressedData: Buffer;
  crc: number;
  compressionMethod: number;
  lastModified: Date;
}

function createZipFile(entries: ZipEntry[]): Buffer {
  const localFileHeaders: Buffer[] = [];
  const centralDirectoryEntries: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const pathBytes = encodeUtf8(entry.path);
    const dosTime =
      ((entry.lastModified.getHours() << 11) |
        (entry.lastModified.getMinutes() << 5) |
        (entry.lastModified.getSeconds() >> 1)) &
      0xffff;
    const dosDate =
      (((entry.lastModified.getFullYear() - 1980) << 9) |
        ((entry.lastModified.getMonth() + 1) << 5) |
        entry.lastModified.getDate()) &
      0xffff;

    const localHeader = Buffer.alloc(30 + pathBytes.length);
    writeUInt32LE(localHeader, 0x04034b50, 0);
    writeUInt16LE(localHeader, 20, 4);
    writeUInt16LE(localHeader, 0, 6);
    writeUInt16LE(localHeader, entry.compressionMethod, 8);
    writeUInt16LE(localHeader, dosTime, 10);
    writeUInt16LE(localHeader, dosDate, 12);
    writeUInt32LE(localHeader, entry.crc, 14);
    writeUInt32LE(localHeader, entry.compressedData.length, 18);
    writeUInt32LE(localHeader, entry.data.length, 22);
    writeUInt16LE(localHeader, pathBytes.length, 26);
    writeUInt16LE(localHeader, 0, 28);
    pathBytes.copy(localHeader, 30);

    localFileHeaders.push(localHeader);
    localFileHeaders.push(entry.compressedData);

    const centralEntry = Buffer.alloc(46 + pathBytes.length);
    writeUInt32LE(centralEntry, 0x02014b50, 0);
    writeUInt16LE(centralEntry, 20, 4);
    writeUInt16LE(centralEntry, 20, 6);
    writeUInt16LE(centralEntry, 0, 8);
    writeUInt16LE(centralEntry, entry.compressionMethod, 10);
    writeUInt16LE(centralEntry, dosTime, 12);
    writeUInt16LE(centralEntry, dosDate, 14);
    writeUInt32LE(centralEntry, entry.crc, 16);
    writeUInt32LE(centralEntry, entry.compressedData.length, 20);
    writeUInt32LE(centralEntry, entry.data.length, 24);
    writeUInt16LE(centralEntry, pathBytes.length, 28);
    writeUInt16LE(centralEntry, 0, 30);
    writeUInt16LE(centralEntry, 0, 32);
    writeUInt16LE(centralEntry, 0, 34);
    writeUInt16LE(centralEntry, 0, 36);
    writeUInt32LE(centralEntry, 0, 38);
    writeUInt32LE(centralEntry, 0, 42);
    writeUInt32LE(centralEntry, offset, 42);
    pathBytes.copy(centralEntry, 46);

    centralDirectoryEntries.push(centralEntry);

    offset += localHeader.length + entry.compressedData.length;
  }

  const centralDirectoryOffset = offset;
  let centralDirectorySize = 0;
  for (const entry of centralDirectoryEntries) {
    centralDirectorySize += entry.length;
  }

  const endOfCentralDirectory = Buffer.alloc(22);
  writeUInt32LE(endOfCentralDirectory, 0x06054b50, 0);
  writeUInt16LE(endOfCentralDirectory, 0, 4);
  writeUInt16LE(endOfCentralDirectory, 0, 6);
  writeUInt16LE(endOfCentralDirectory, entries.length, 8);
  writeUInt16LE(endOfCentralDirectory, entries.length, 10);
  writeUInt32LE(endOfCentralDirectory, centralDirectorySize, 12);
  writeUInt32LE(endOfCentralDirectory, centralDirectoryOffset, 16);
  writeUInt16LE(endOfCentralDirectory, 0, 20);

  return Buffer.concat([...localFileHeaders, ...centralDirectoryEntries, endOfCentralDirectory]);
}

function addFolderEntries(entries: Set<string>, path: string) {
  const parts = path.split("/");
  let current = "";
  for (let i = 0; i < parts.length - 1; i++) {
    current = current ? `${current}/${parts[i]}` : parts[i];
    entries.add(current + "/");
  }
}

export class FolderDownloadService {
  async collectFolderFiles(folderId: string): Promise<{
    folderName: string;
    files: FolderFileInfo[];
  }> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { id: true, name: true },
    });

    if (!folder) throw new Error("Folder not found");

    const files: FolderFileInfo[] = [];
    await this.collectFilesRecursive(folderId, folder.name, files);

    logger.info("Collected folder files for download", {
      folderId,
      folderName: folder.name,
      fileCount: files.length,
    });

    return { folderName: folder.name, files };
  }

  private async collectFilesRecursive(
    folderId: string,
    folderPath: string,
    files: FolderFileInfo[]
  ): Promise<void> {
    const documents = await prisma.document.findMany({
      where: { folderId, status: "active" },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
      },
    });

    for (const doc of documents) {
      files.push({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        folderPath,
      });
    }

    const subfolders = await prisma.folder.findMany({
      where: { parentId: folderId },
      select: { id: true, name: true },
    });

    for (const subfolder of subfolders) {
      await this.collectFilesRecursive(subfolder.id, `${folderPath}/${subfolder.name}`, files);
    }
  }

  async createZipBuffer(folderName: string, files: FolderFileInfo[]): Promise<Buffer> {
    const entries: ZipEntry[] = [];
    const folderPaths = new Set<string>();

    for (const file of files) {
      let data: Buffer;
      try {
        const response = await fetch(file.fileUrl);
        if (!response.ok) {
          logger.warn("Failed to fetch file for ZIP, skipping", {
            fileId: file.id,
            fileName: file.fileName,
            status: response.status,
          });
          continue;
        }
        data = Buffer.from(await response.arrayBuffer());
      } catch (err) {
        logger.warn("Error fetching file for ZIP, skipping", {
          fileId: file.id,
          fileName: file.fileName,
          error: err instanceof Error ? err.message : String(err),
        });
        continue;
      }

      const path = `${file.folderPath}/${file.fileName}`;
      const crc = crc32(data);
      const compressedData = deflateRawSync(data);
      addFolderEntries(folderPaths, path);

      entries.push({
        path,
        data,
        compressedData,
        crc,
        compressionMethod: 8,
        lastModified: new Date(),
      });
    }

    for (const dirPath of folderPaths) {
      const dirData = Buffer.alloc(0);
      entries.push({
        path: dirPath,
        data: dirData,
        compressedData: dirData,
        crc: 0,
        compressionMethod: 0,
        lastModified: new Date(),
      });
    }

    return createZipFile(entries);
  }
}

export const folderDownloadService = new FolderDownloadService();
