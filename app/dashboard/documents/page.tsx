"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  FileText,
  LayoutGrid,
  List,
  Folder,
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DocumentsTable } from "@/components/features/documents/documents-table";
import { DocumentsGrid } from "@/components/features/documents/documents-grid";
import { DocumentUploadModal } from "@/components/features/documents/document-upload-modal";
import {
  useDocuments,
  useCategories,
  useTags,
  useFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from "@/hooks/use-api";

type ViewMode = "list" | "grid";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Folder modal state
  const [folderModal, setFolderModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    id?: string;
    name: string;
    description: string;
  }>({ open: false, mode: "create", name: "", description: "" });
  const [deleteFolderConfirm, setDeleteFolderConfirm] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const { data, isLoading, error, refetch } = useDocuments({
    query: searchQuery,
    page,
    limit: 20,
    categoryId: selectedCategory,
    tagId: selectedTag,
    status: selectedStatus,
    folderId: selectedFolderId,
  });

  const { data: categoriesData } = useCategories({ limit: 100, page: 1 });
  const { data: tagsData } = useTags({ limit: 100, page: 1 });
  const { data: foldersData, refetch: refetchFolders } = useFolders();

  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();

  const documents = data?.data?.documents || [];
  const pagination = data?.data?.pagination;
  const categories = categoriesData?.data?.categories || [];
  const tags = tagsData?.data?.tags || [];
  const folders = foldersData?.data || [];

  const activeFiltersCount = [selectedCategory, selectedTag, selectedStatus].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
    setSelectedStatus(undefined);
    setPage(1);
  };

  const handleFolderSave = async () => {
    if (!folderModal.name.trim()) return;
    if (folderModal.mode === "create") {
      await createFolder.mutateAsync({
        name: folderModal.name,
        description: folderModal.description || undefined,
      });
    } else if (folderModal.id) {
      await updateFolder.mutateAsync({
        id: folderModal.id,
        data: { name: folderModal.name, description: folderModal.description || undefined },
      });
    }
    setFolderModal({ open: false, mode: "create", name: "", description: "" });
    refetchFolders();
  };

  const handleDeleteFolder = async () => {
    if (!deleteFolderConfirm.id) return;
    await deleteFolder.mutateAsync(deleteFolderConfirm.id);
    if (selectedFolderId === deleteFolderConfirm.id) setSelectedFolderId(undefined);
    setDeleteFolderConfirm({ open: false });
    refetchFolders();
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-red-500 font-medium">Error al cargar documentos.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Verifica tu conexión e intenta de nuevo.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Reintentar
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
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">Gestiona y organiza los documentos del sistema</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Folder Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Carpetas
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                setFolderModal({ open: true, mode: "create", name: "", description: "" })
              }
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* All documents */}
          <button
            onClick={() => {
              setSelectedFolderId(undefined);
              setPage(1);
            }}
            className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              selectedFolderId === undefined
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate">Todos</span>
            <span className="text-xs opacity-70">{pagination?.total ?? ""}</span>
          </button>

          {/* Folders list */}
          {folders.map((folder) => (
            <div key={folder.id} className="group flex items-center gap-1">
              <button
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setPage(1);
                }}
                className={`flex-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors min-w-0 ${
                  selectedFolderId === folder.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {selectedFolderId === folder.id ? (
                  <FolderOpen className="h-4 w-4 shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 shrink-0" />
                )}
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className="text-xs opacity-70">{folder._count.documents}</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      setFolderModal({
                        open: true,
                        mode: "edit",
                        id: folder.id,
                        name: folder.name,
                        description: folder.description || "",
                      })
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Renombrar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      setDeleteFolderConfirm({ open: true, id: folder.id, name: folder.name })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb when folder selected */}
          {selectedFolder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => setSelectedFolderId(undefined)} className="hover:underline">
                Todos
              </button>
              <span>/</span>
              <span className="font-medium text-foreground">{selectedFolder.name}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos por nombre..."
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
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {/* View toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none h-9 w-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none h-9 w-9"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
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
                    <SelectItem value="all">Todas las Categorías</SelectItem>
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
                    <SelectItem value="all">Todas las Etiquetas</SelectItem>
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
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}

            {/* Active filter badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1 pl-2">
                    Categoría: {categories.find((c) => c.id === selectedCategory)?.name}
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
                    Etiqueta: {tags.find((t) => t.id === selectedTag)?.name}
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
                    Estado: {selectedStatus}
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

          {/* Document View */}
          <Card>
            <CardContent className="p-0">
              {viewMode === "list" ? (
                <DocumentsTable
                  documents={documents}
                  isLoading={isLoading}
                  onDelete={() => refetch()}
                />
              ) : (
                <DocumentsGrid
                  documents={documents}
                  isLoading={isLoading}
                  onDelete={() => refetch()}
                />
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pagination.total === 0 ? (
                  "Sin documentos encontrados"
                ) : (
                  <>
                    Mostrando {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
                    {pagination.total} documentos
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
                    Anterior
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
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => refetch()}
        defaultFolderId={selectedFolderId}
      />

      {/* Folder Create/Edit Modal */}
      <Dialog
        open={folderModal.open}
        onOpenChange={(open) => {
          if (!open) setFolderModal({ open: false, mode: "create", name: "", description: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {folderModal.mode === "create" ? "Nueva Carpeta" : "Renombrar Carpeta"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nombre *</Label>
              <Input
                value={folderModal.name}
                onChange={(e) => setFolderModal((s) => ({ ...s, name: e.target.value }))}
                placeholder="Nombre de la carpeta"
                onKeyDown={(e) => e.key === "Enter" && handleFolderSave()}
              />
            </div>
            <div className="space-y-1">
              <Label>Descripción</Label>
              <Input
                value={folderModal.description}
                onChange={(e) => setFolderModal((s) => ({ ...s, description: e.target.value }))}
                placeholder="Descripción opcional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setFolderModal({ open: false, mode: "create", name: "", description: "" })
              }
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFolderSave}
              disabled={
                !folderModal.name.trim() || createFolder.isPending || updateFolder.isPending
              }
            >
              {folderModal.mode === "create" ? "Crear" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Confirm */}
      <Dialog
        open={deleteFolderConfirm.open}
        onOpenChange={(open) => {
          if (!open) setDeleteFolderConfirm({ open: false });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Carpeta</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Eliminar la carpeta <strong>{deleteFolderConfirm.name}</strong>? Los documentos dentro
            no se eliminarán, solo se moverán a &quot;Todos&quot;.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFolderConfirm({ open: false })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFolder}
              disabled={deleteFolder.isPending}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
