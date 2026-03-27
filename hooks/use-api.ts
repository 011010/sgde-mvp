"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE = "/api";

// Generic fetch function
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

// USERS HOOKS
export function useUsers(params?: { query?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          users: Array<{
            id: string;
            name: string | null;
            email: string;
            image: string | null;
            createdAt: string;
            userRoles: Array<{
              role: {
                id: string;
                name: string;
                description: string | null;
              };
            }>;
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/users?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; email?: string; image?: string | null };
    }) =>
      fetchApi(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
      fetchApi(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ roleIds }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User roles updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/users/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// CATEGORIES HOOKS
export function useCategories(params?: { query?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          categories: Array<{
            id: string;
            name: string;
            description: string | null;
            color: string | null;
            _count: { documents: number };
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/categories?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; color?: string }) =>
      fetchApi("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; color?: string };
    }) =>
      fetchApi(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// TAGS HOOKS
export function useTags(params?: { query?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          tags: Array<{
            id: string;
            name: string;
            _count: { documents: number };
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/tags?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      fetchApi("/tags", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string } }) =>
      fetchApi(`/tags/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/tags/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ROLES HOOKS
export function useRoles(params?: { query?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          roles: Array<{
            id: string;
            name: string;
            description: string | null;
            rolePermissions: Array<{
              permission: {
                id: string;
                name: string;
                resource: string;
                action: string;
              };
            }>;
            _count: { userRoles: number };
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/roles?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          permissions: Array<{
            id: string;
            name: string;
            resource: string;
            action: string;
          }>;
        };
      }>("/roles/permissions"),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; permissionIds?: string[] }) =>
      fetchApi("/roles", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      fetchApi(`/roles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }: { id: string; permissionIds: string[] }) =>
      fetchApi(`/roles/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ permissionIds }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/roles/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// DOCUMENTS HOOKS
export function useDocument(id: string | null) {
  return useQuery({
    queryKey: ["document", id],
    enabled: !!id,
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          id: string;
          title: string;
          description: string | null;
          fileName: string;
          fileSize: number;
          fileUrl: string;
          status: string;
          source: string;
          createdAt: string;
          user: { name: string | null; email: string };
          categories: Array<{ id: string; name: string; color: string | null }>;
          tags: Array<{ id: string; name: string }>;
        };
      }>(`/documents/${id}`),
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        description?: string;
        status?: string;
        categoryIds?: string[];
        tagIds?: string[];
      };
    }) =>
      fetchApi(`/documents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
      toast.success("Documento actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// FOLDERS HOOKS
export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          description: string | null;
          createdAt: string;
          _count: { documents: number };
        }>;
      }>("/folders"),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      fetchApi("/folders", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Carpeta creada exitosamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      fetchApi(`/folders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Carpeta actualizada exitosamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchApi(`/folders/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Carpeta eliminada exitosamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDocuments(params?: {
  query?: string;
  categoryId?: string;
  tagId?: string;
  source?: string;
  status?: string;
  folderId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          documents: Array<{
            id: string;
            title: string;
            fileName: string;
            fileSize: number;
            status: string;
            source: string;
            createdAt: string;
            user: {
              name: string | null;
              email: string;
            };
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/documents?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.categoryId && { categoryId: params.categoryId }),
          ...(params?.tagId && { tagId: params.tagId }),
          ...(params?.source && { source: params.source }),
          ...(params?.status && { status: params.status }),
          ...(params?.folderId !== undefined && { folderId: params.folderId }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/documents/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useShareDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      sharedWith,
      permission,
      expiresAt,
    }: {
      documentId: string;
      sharedWith: string;
      permission: "view" | "edit" | "admin";
      expiresAt?: string;
    }) =>
      fetchApi(`/documents/${documentId}/share`, {
        method: "POST",
        body: JSON.stringify({ documentId, sharedWith, permission, expiresAt }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document shared successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useBulkDeleteDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      fetchApi(`/documents/bulk-delete`, {
        method: "POST",
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Documents deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// AUDIT LOGS HOOKS
export function useAuditLogs(params?: {
  query?: string;
  userId?: string;
  resource?: string;
  action?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          logs: Array<{
            id: string;
            action: string;
            resource: string;
            resourceId: string;
            details: string;
            createdAt: string;
            user: {
              name: string | null;
              email: string;
              image: string | null;
            };
          }>;
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }>(
        `/audit-logs?${new URLSearchParams({
          ...(params?.query && { query: params.query }),
          ...(params?.userId && { userId: params.userId }),
          ...(params?.resource && { resource: params.resource }),
          ...(params?.action && { action: params.action }),
          ...(params?.page && { page: params.page.toString() }),
          ...(params?.limit && { limit: params.limit.toString() }),
        }).toString()}`
      ),
  });
}

export function useAuditLogFilters() {
  return useQuery({
    queryKey: ["audit-log-filters"],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          resources: string[];
          actions: string[];
        };
      }>("/audit-logs/filters"),
  });
}

// SETTINGS HOOKS
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          id: string;
          name: string | null;
          email: string;
          image: string | null;
          createdAt: string;
          updatedAt: string;
        };
      }>("/users/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; image?: string | null }) =>
      fetchApi("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      fetchApi("/users/me/password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: () =>
      fetchApi<{
        success: boolean;
        data: {
          emailNotifications: boolean;
          documentShared: boolean;
          documentUpdated: boolean;
          systemUpdates: boolean;
        };
      }>("/users/me/notifications"),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      emailNotifications: boolean;
      documentShared: boolean;
      documentUpdated: boolean;
      systemUpdates: boolean;
    }) =>
      fetchApi("/users/me/notifications", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
