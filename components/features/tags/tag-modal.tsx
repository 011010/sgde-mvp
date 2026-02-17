"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTag, useUpdateTag } from "@/hooks/use-api";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: {
    id: string;
    name: string;
  } | null;
}

export function TagModal({ isOpen, onClose, tag }: TagModalProps) {
  const isEditing = !!tag;
  const [name, setName] = useState(tag?.name || "");

  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && tag) {
      await updateTag.mutateAsync({
        id: tag.id,
        data: { name: name.toLowerCase().replace(/\s+/g, "-") },
      });
    } else {
      await createTag.mutateAsync({ name: name.toLowerCase().replace(/\s+/g, "-") });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tag" : "Add Tag"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update tag name" : "Create a new tag for labeling documents"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="tag-name"
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
            />
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTag.isPending || updateTag.isPending}>
              {(createTag.isPending || updateTag.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Create Tag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
