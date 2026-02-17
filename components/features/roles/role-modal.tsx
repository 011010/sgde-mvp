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
import { useCreateRole, useUpdateRole } from "@/hooks/use-api";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const isEditing = !!role;
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && role) {
      await updateRole.mutateAsync({
        id: role.id,
        data: { name, description },
      });
    } else {
      await createRole.mutateAsync({ name, description });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Add Role"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update role details" : "Create a new role for user management"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Role name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Role description (optional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRole.isPending || updateRole.isPending}>
              {(createRole.isPending || updateRole.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
