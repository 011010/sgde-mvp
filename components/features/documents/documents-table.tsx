"use client";

import { useState } from "react";
import { MoreVertical, Download, Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  status: string;
  source: string;
  fileUrl?: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface DocumentsTableProps {
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

const sourceLabels: Record<string, string> = {
  local: "Local",
  google_drive: "Google Drive",
  one_drive: "OneDrive",
  dropbox: "Dropbox",
};

export function DocumentsTable({ documents, isLoading, onDelete }: DocumentsTableProps) {
  const deleteDocument = useDeleteDocument();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteDocument.mutateAsync(id);
    onDelete?.(id);
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Archivo</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Subido por</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Archivo</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Subido por</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                Sin documentos encontrados
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{document.fileName}</TableCell>
                <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                <TableCell>{document.user.name || document.user.email}</TableCell>
                <TableCell>{formatDate(document.createdAt, "PPP")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      document.status === "active"
                        ? "default"
                        : document.status === "archived"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {statusLabels[document.status] || document.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {sourceLabels[document.source] || document.source.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a
                          href={document.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingId(document.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(document.id)}
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <EditDocumentModal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        documentId={editingId}
      />
    </>
  );
}
