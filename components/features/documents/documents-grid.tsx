"use client";

import { useState } from "react";
import {
  MoreVertical,
  Download,
  Edit,
  Trash2,
  Loader2,
  FileText,
  FileImage,
  FileSpreadsheet,
  Archive,
  File,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatFileSize } from "@/utils/formatters";
import { useDeleteDocument } from "@/hooks/use-api";
import { EditDocumentModal } from "@/components/features/documents/edit-document-modal";

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  status: string;
  source: string;
  fileUrl?: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface DocumentsGridProps {
  documents: Document[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  archived: "Archivado",
  draft: "Borrador",
  deleted: "Eliminado",
};

function FileIcon({ mimeType, fileName }: { mimeType?: string; fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const mime = mimeType || "";

  if (mime.startsWith("image/")) return <FileImage className="h-8 w-8 text-blue-500" />;
  if (mime === "application/pdf") return <FileText className="h-8 w-8 text-red-500" />;
  if (mime.includes("spreadsheet") || ext === "xls" || ext === "xlsx")
    return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
  if (mime.includes("presentation") || ext === "ppt" || ext === "pptx")
    return <File className="h-8 w-8 text-orange-500" />;
  if (mime.includes("zip") || ext === "zip") return <Archive className="h-8 w-8 text-yellow-600" />;
  return <File className="h-8 w-8 text-muted-foreground" />;
}

export function DocumentsGrid({ documents, isLoading, onDelete }: DocumentsGridProps) {
  const deleteDocument = useDeleteDocument();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteDocument.mutateAsync(id);
    onDelete?.(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="h-12 w-12 mb-3 opacity-30" />
        <p>Sin documentos encontrados</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 p-2 rounded-lg bg-muted">
                  <FileIcon mimeType={doc.mimeType} fileName={doc.fileName} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm line-clamp-2 leading-tight">{doc.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatFileSize(doc.fileSize)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href={doc.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingId(doc.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteDocument.isPending}
                  >
                    {deleteDocument.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-xs text-muted-foreground truncate">
              {doc.user.name || doc.user.email}
            </div>

            <div className="flex items-center justify-between">
              <Badge
                variant={
                  doc.status === "active"
                    ? "default"
                    : doc.status === "archived"
                      ? "secondary"
                      : "outline"
                }
                className="text-xs"
              >
                {statusLabels[doc.status] || doc.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(doc.createdAt, "PP")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <EditDocumentModal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        documentId={editingId}
      />
    </>
  );
}
