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
import { usePermissions, useUpdateRolePermissions } from "@/hooks/use-api";

interface ManageRolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: {
    id: string;
    name: string;
    rolePermissions: Array<{
      permission: {
        id: string;
        name: string;
        resource: string;
        action: string;
      };
    }>;
  } | null;
}

function getInitialPermissions(role: ManageRolePermissionsModalProps["role"]) {
  return role?.rolePermissions.map((rp) => rp.permission.id) || [];
}

export function ManageRolePermissionsModal({
  isOpen,
  onClose,
  role,
}: ManageRolePermissionsModalProps) {
  const { data: permissionsData } = usePermissions();
  const updateRolePermissions = useUpdateRolePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(() =>
    getInitialPermissions(role)
  );

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    await updateRolePermissions.mutateAsync({
      id: role.id,
      permissionIds: selectedPermissions,
    });
    onClose();
  };

  // Group permissions by resource
  const permissionsByResource = permissionsData?.data?.permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    },
    {} as Record<string, typeof permissionsData.data.permissions>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>Assign permissions to {role?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {permissionsByResource &&
            Object.entries(permissionsByResource).map(([resource, permissions]) => (
              <div key={resource} className="space-y-2">
                <h4 className="font-medium capitalize">{resource.replace("_", " ")}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                      <Label htmlFor={permission.id} className="font-normal text-sm">
                        {permission.action}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateRolePermissions.isPending}>
              {updateRolePermissions.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Permissions
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
