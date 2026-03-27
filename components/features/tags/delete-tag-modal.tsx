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

  const docCount = tag?._count?.documents || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Etiqueta</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la etiqueta &quot;{tag?.name}&quot;?
            {docCount > 0 && (
              <span className="mt-2 block text-amber-600">
                Esta etiqueta tiene {docCount} documento(s) asociado(s). Al eliminarla, se
                desvinculará de esos documentos.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteTag.isPending}>
            {deleteTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Etiqueta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
