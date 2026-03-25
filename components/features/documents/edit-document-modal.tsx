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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocument, useUpdateDocument, useCategories, useTags } from "@/hooks/use-api";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
}

interface DocumentData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  categories: Array<{ id: string; name: string; color: string | null }>;
  tags: Array<{ id: string; name: string }>;
}

interface Category {
  id: string;
  name: string;
  color?: string | null;
}

interface Tag {
  id: string;
  name: string;
}

interface EditFormProps {
  document: DocumentData;
  categories: Category[];
  tags: Tag[];
  onClose: () => void;
}

function EditForm({ document, categories, tags, onClose }: EditFormProps) {
  const updateDocument = useUpdateDocument();
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || "");
  const [status, setStatus] = useState(document.status);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    document.categories.map((c) => c.id)
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(document.tags.map((t) => t.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDocument.mutateAsync({
      id: document.id,
      data: {
        title,
        description: description || undefined,
        status,
        categoryIds: selectedCategories,
        tagIds: selectedTags,
      },
    });
    onClose();
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 py-2">
      <div className="space-y-2">
        <Label htmlFor="doc-title">Título</Label>
        <Input
          id="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del documento"
          required
          disabled={updateDocument.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doc-description">Descripción</Label>
        <Input
          id="doc-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción opcional"
          disabled={updateDocument.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label>Estado</Label>
        <Select value={status} onValueChange={setStatus} disabled={updateDocument.isPending}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="archived">Archivado</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Categorías</Label>
          <div className="rounded-lg border p-3 space-y-2 max-h-36 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  disabled={updateDocument.isPending}
                />
                <Label htmlFor={`cat-${cat.id}`} className="font-normal cursor-pointer">
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>Etiquetas</Label>
          <div className="rounded-lg border p-3 flex flex-wrap gap-2 max-h-36 overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-1.5">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                  disabled={updateDocument.isPending}
                />
                <Label htmlFor={`tag-${tag.id}`} className="font-normal cursor-pointer text-sm">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={updateDocument.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={updateDocument.isPending}>
          {updateDocument.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditDocumentModal({ isOpen, onClose, documentId }: EditDocumentModalProps) {
  const { data: docData, isLoading: docLoading } = useDocument(documentId);
  const { data: categoriesData } = useCategories({ limit: 100, page: 1 });
  const { data: tagsData } = useTags({ limit: 100, page: 1 });

  const document = docData?.data;
  const categories = categoriesData?.data?.categories || [];
  const tags = tagsData?.data?.tags || [];

  const isLoading = docLoading && !!documentId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
          <DialogDescription>
            Actualiza la información, categorías y etiquetas del documento.
          </DialogDescription>
        </DialogHeader>

        {isLoading || !document ? (
          <div className="space-y-4 py-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <EditForm document={document} categories={categories} tags={tags} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
