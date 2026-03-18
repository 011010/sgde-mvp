"use client";

import { useState } from "react";
import { Plus, Search, SlidersHorizontal, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentsTable } from "@/components/features/documents/documents-table";
import { DocumentUploadModal } from "@/components/features/documents/document-upload-modal";
import { useDocuments, useCategories, useTags } from "@/hooks/use-api";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const { data, isLoading, error, refetch } = useDocuments({
    query: searchQuery,
    page,
    limit: 20,
    categoryId: selectedCategory,
    tagId: selectedTag,
    status: selectedStatus,
  });

  const { data: categoriesData } = useCategories({ limit: 100, page: 1 });
  const { data: tagsData } = useTags({ limit: 100, page: 1 });

  const documents = data?.data?.documents || [];
  const pagination = data?.data?.pagination;
  const categories = categoriesData?.data?.categories || [];
  const tags = tagsData?.data?.tags || [];

  const activeFiltersCount = [selectedCategory, selectedTag, selectedStatus].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
    setSelectedStatus(undefined);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-red-500 font-medium">Failed to load documents.</p>
            <p className="text-sm text-muted-foreground mt-1">Please check your connection and try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-4">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(v) => {
                setSelectedCategory(v === "all" ? undefined : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTag || "all"}
              onValueChange={(v) => {
                setSelectedTag(v === "all" ? undefined : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus || "all"}
              onValueChange={(v) => {
                setSelectedStatus(v === "all" ? undefined : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Active filter badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1 pl-2">
                Category: {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1 pl-2">
                Tag: {tags.find((t) => t.id === selectedTag)?.name}
                <button
                  onClick={() => setSelectedTag(undefined)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="secondary" className="gap-1 pl-2">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus(undefined)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <DocumentsTable documents={documents} isLoading={isLoading} onDelete={() => refetch()} />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination.total === 0 ? (
              "No documents found"
            ) : (
              <>
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} documents
              </>
            )}
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
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
