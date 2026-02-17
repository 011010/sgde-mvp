"use client";

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

export function DocumentsTable({ documents, isLoading, onDelete }: DocumentsTableProps) {
  const deleteDocument = useDeleteDocument();

  const handleDelete = async (id: string) => {
    await deleteDocument.mutateAsync(id);
    onDelete?.(id);
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground">
              No documents found
            </TableCell>
          </TableRow>
        ) : (
          documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.title}</TableCell>
              <TableCell className="text-muted-foreground">{document.fileName}</TableCell>
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
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{document.source.replace("_", " ")}</Badge>
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
                      <a href={document.fileUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
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
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
