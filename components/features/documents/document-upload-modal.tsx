"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { X, FileText, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import type { OurFileRouter } from "@/lib/infrastructure/storage/uploadthing";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  key: string;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DocumentUploadModal({ isOpen, onClose, onSuccess }: DocumentUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    if (files.length > 0 && !title) {
      setTitle(files[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Por favor sube al menos un archivo");
      return;
    }

    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    setIsSubmitting(true);

    try {
      for (const file of uploadedFiles) {
        const response = await fetch("/api/documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            fileName: file.name,
            fileSize: file.size,
            mimeType: getMimeType(file.name),
            fileUrl: file.url,
            source: "local",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al crear el documento");
        }
      }

      toast.success(
        uploadedFiles.length === 1
          ? "Documento subido exitosamente"
          : `${uploadedFiles.length} documentos subidos exitosamente`
      );

      setUploadedFiles([]);
      setTitle("");
      setDescription("");
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al subir el documento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUploadedFiles([]);
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const getMimeType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
      csv: "text/csv",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      zip: "application/zip",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
          <DialogDescription>
            Sube archivos al sistema de gestión documental. Formatos admitidos: PDF, Word, Excel,
            PowerPoint, imágenes y archivos de texto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {uploadedFiles.length === 0 ? (
            <UploadDropzone<OurFileRouter, "documentUploader">
              endpoint="documentUploader"
              config={{ mode: "auto" }}
              onClientUploadComplete={(res) => {
                if (res) {
                  const files = res.map((file) => ({
                    name: file.name,
                    size: file.size,
                    url: file.url,
                    key: file.key,
                  }));
                  handleUploadComplete(files);
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
              appearance={{
                container:
                  "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer",
                label: "text-primary hover:text-primary/80",
                allowedContent: "text-muted-foreground text-sm",
              }}
            />
          ) : (
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <UploadDropzone<OurFileRouter, "documentUploader">
                endpoint="documentUploader"
                config={{ mode: "auto" }}
                onClientUploadComplete={(res) => {
                  if (res) {
                    const files = res.map((file) => ({
                      name: file.name,
                      size: file.size,
                      url: file.url,
                      key: file.key,
                    }));
                    handleUploadComplete(files);
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                }}
                appearance={{
                  container:
                    "border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer",
                  label: "text-primary text-sm hover:text-primary/80",
                  allowedContent: "hidden",
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título del documento"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingresa la descripción del documento (opcional)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploadedFiles.length === 0 || !title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Subir Documento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
