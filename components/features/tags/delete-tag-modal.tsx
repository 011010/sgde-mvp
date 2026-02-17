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
import { useDeleteTag } from "@/hooks/use-api";

interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: {
    id: string;
    name: string;
    _count?: { documents: number };
  } | null;
}

export function DeleteTagModal({ isOpen, onClose, tag }: DeleteTagModalProps) {
  const deleteTag = useDeleteTag();

  const handleDelete = async () => {
    if (!tag) return;
    await deleteTag.mutateAsync(tag.id);
    onClose();
  };

  const hasDocuments = (tag?._count?.documents || 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the tag &quot;{tag?.name}&quot;?
            {hasDocuments && (
              <span className="mt-2 block text-red-500">
                Warning: This tag has {tag?._count?.documents} document(s) associated with it. You
                cannot delete a tag with associated documents.
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
            disabled={deleteTag.isPending || hasDocuments}
          >
            {deleteTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Tag
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
