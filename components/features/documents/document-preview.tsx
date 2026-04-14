"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Download, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDate } from "@/utils/formatters";

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileUrl: string;
    status: string;
    source: string;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreview({ document, isOpen, onClose }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  if (!document) return null;

  const isImage = document.mimeType.startsWith("image/");
  const isPDF = document.mimeType === "application/pdf";
  const isText =
    document.mimeType.startsWith("text/") ||
    document.mimeType === "application/json" ||
    document.mimeType === "application/javascript";

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center overflow-auto bg-gray-100 rounded-lg min-h-[400px]">
          <Image
            src={document.fileUrl}
            alt={document.title}
            width={800}
            height={600}
            className="max-w-full max-h-[600px] object-contain transition-transform"
            style={{ transform: `scale(${zoom / 100})` }}
            unoptimized
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={`${document.fileUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title={document.title}
          />
        </div>
      );
    }

    if (isText) {
      return (
        <div className="w-full h-[600px] bg-gray-50 rounded-lg overflow-auto p-4">
          <iframe
            src={document.fileUrl}
            className="w-full h-full border-0 bg-white"
            title={document.title}
            sandbox="allow-same-origin"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <FileText className="h-24 w-24 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Preview not available for this file type</p>
        <p className="text-sm text-gray-500 mb-4">{document.mimeType}</p>
        <a
          href={document.fileUrl}
          download={document.fileName}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download File
          </Button>
        </a>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-xl truncate pr-4">{document.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{document.fileName}</span>
              <span>•</span>
              <span>{formatFileSize(document.fileSize)}</span>
              <span>•</span>
              <Badge variant="outline">{document.source}</Badge>
              <Badge variant={document.status === "active" ? "default" : "secondary"}>
                {document.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-16 text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
            <a
              href={document.fileUrl}
              download={document.fileName}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </DialogHeader>

        <div className="mt-4">{renderPreview()}</div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
          <div>Uploaded by {document.user.name || document.user.email}</div>
          <div>{formatDate(document.createdAt)}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
