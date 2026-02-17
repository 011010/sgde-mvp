"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentsTable } from "@/components/features/documents/documents-table";
import { DocumentUploadModal } from "@/components/features/documents/document-upload-modal";
import { useDocuments } from "@/hooks/use-api";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useDocuments({
    query: searchQuery,
    page,
    limit: 20,
  });

  const documents = data?.data?.documents || [];
  const pagination = data?.data?.pagination;

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Failed to load documents. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DocumentsTable documents={documents} isLoading={isLoading} onDelete={() => refetch()} />
        </CardContent>
      </Card>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
            documents
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
