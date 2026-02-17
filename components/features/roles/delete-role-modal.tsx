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
import { useDeleteRole } from "@/hooks/use-api";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: {
    id: string;
    name: string;
    _count?: { userRoles: number };
  } | null;
}

export function DeleteRoleModal({ isOpen, onClose, role }: DeleteRoleModalProps) {
  const deleteRole = useDeleteRole();

  const handleDelete = async () => {
    if (!role) return;
    await deleteRole.mutateAsync(role.id);
    onClose();
  };

  const hasUsers = (role?._count?.userRoles || 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role &quot;{role?.name}&quot;?
            {hasUsers && (
              <span className="mt-2 block text-red-500">
                Warning: This role is assigned to {role?._count?.userRoles} user(s). You cannot
                delete a role with assigned users.
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
            disabled={deleteRole.isPending || hasUsers}
          >
            {deleteRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
