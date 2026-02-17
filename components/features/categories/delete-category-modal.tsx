"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteCategory } from "@/hooks/use-api";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    _count?: { documents: number };
  } | null;
}

export function DeleteCategoryModal({ isOpen, onClose, category }: DeleteCategoryModalProps) {
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;
    await deleteCategory.mutateAsync(category.id);
    onClose();
  };

  const hasDocuments = (category?._count?.documents || 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category?.name}&quot;?
            {hasDocuments && (
              <span className="mt-2 block text-red-500">
                Warning: This category has {category?._count?.documents} document(s) associated with
                it. You cannot delete a category with associated documents.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategory.isPending || hasDocuments}
          >
            {deleteCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
