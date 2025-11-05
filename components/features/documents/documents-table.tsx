"use client";

import { MoreVertical, Download, Edit, Trash2 } from "lucide-react";
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
import { formatDate, formatFileSize } from "@/utils/formatters";

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  status: string;
  source: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface DocumentsTableProps {
  documents: Document[];
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
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
                      ? "success"
                      : document.status === "archived"
                        ? "warning"
                        : "secondary"
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
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
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
