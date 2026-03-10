"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Pencil, Trash2, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useTags } from "@/hooks/use-api";
import { TagModal } from "@/components/features/tags/tag-modal";
import { DeleteTagModal } from "@/components/features/tags/delete-tag-modal";

interface Tag {
  id: string;
  name: string;
  _count: { documents: number };
}

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useTags({
    query: searchQuery,
    page,
    limit: 20,
  });

  const tags = data?.data?.tags || [];
  const pagination = data?.data?.pagination;

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <TagIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-red-500 font-medium">Failed to load tags.</p>
            <p className="text-sm text-muted-foreground mt-1">Please check your connection and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">Manage document tags and labels</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {/* Tag Cloud Overview */}
      {!isLoading && tags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tag Overview</CardTitle>
            <CardDescription>All tags at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1.5 rounded-full border bg-secondary/50 hover:bg-secondary px-3 py-1.5 transition-colors cursor-pointer"
                >
                  <TagIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 ml-0.5">
                    {tag._count.documents}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags Grid */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex-1">All Tags</CardTitle>
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : tags.length === 0 ? (
            <div className="py-16 text-center">
              <TagIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">No tags found</p>
              {searchQuery ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              ) : (
                <Button size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first tag
                </Button>
              )}
            </div>
          ) : (
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group flex items-center justify-between rounded-lg border bg-card p-4 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <TagIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{tag.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tag._count.documents}{" "}
                        {tag._count.documents === 1 ? "document" : "documents"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {tag._count.documents}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTag(tag)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingTag(tag)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} tags
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
        </CardContent>
      </Card>

      <TagModal
        isOpen={isModalOpen || !!editingTag}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTag(null);
        }}
        tag={editingTag}
      />

      <DeleteTagModal
        isOpen={!!deletingTag}
        onClose={() => setDeletingTag(null)}
        tag={deletingTag}
      />
    </div>
  );
}
