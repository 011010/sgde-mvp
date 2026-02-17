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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRoles, useUpdateUserRoles } from "@/hooks/use-api";

interface ManageUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    userRoles: Array<{
      role: {
        id: string;
        name: string;
      };
    }>;
  } | null;
}

export function ManageUserRolesModal({ isOpen, onClose, user }: ManageUserRolesModalProps) {
  const { data: rolesData } = useRoles();
  const updateUserRoles = useUpdateUserRoles();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user?.userRoles.map((ur) => ur.role.id) || []
  );

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateUserRoles.mutateAsync({
      id: user.id,
      roleIds: selectedRoles,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription>
            Assign roles to {user?.name || user?.userRoles?.[0]?.role?.name || "user"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {rolesData?.data?.roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={role.id}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleToggleRole(role.id)}
                />
                <Label htmlFor={role.id} className="font-normal">
                  {role.name}
                  {role.description && (
                    <span className="ml-2 text-sm text-muted-foreground">- {role.description}</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserRoles.isPending}>
              {updateUserRoles.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Roles
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
