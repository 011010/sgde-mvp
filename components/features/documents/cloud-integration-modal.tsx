"use client";

import { useState } from "react";
import { Cloud, CloudOff, RefreshCw, Folder, File, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ScrollArea component imported separately
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  isFolder: boolean;
}

interface CloudIntegrationModalProps {
  onImport?: (files: CloudFile[], provider: "google" | "onedrive") => void;
}

export function CloudIntegrationModal({ onImport }: CloudIntegrationModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("google");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const fetchFiles = async (provider: "google" | "onedrive") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cloud/${provider}/files`);
      const data = await response.json();
      if (data.success) {
        setFiles(data.data.files);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleImport = () => {
    const selected = files.filter((file) => selectedFiles.includes(file.id));
    onImport?.(selected, activeTab as "google" | "onedrive");
    setOpen(false);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Cloud className="h-4 w-4" />
          Import from Cloud
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Documents from Cloud Storage</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="google"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setSelectedFiles([]);
            fetchFiles(value as "google" | "onedrive");
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google Drive
            </TabsTrigger>
            <TabsTrigger value="onedrive" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
              OneDrive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="mt-4">
            {renderFileList()}
          </TabsContent>

          <TabsContent value="onedrive" className="mt-4">
            {renderFileList()}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            {selectedFiles.length} file(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={selectedFiles.length === 0}>
              <Check className="h-4 w-4 mr-2" />
              Import Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  function renderFileList() {
    return (
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <span className="font-medium">Files</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchFiles(activeTab as "google" | "onedrive")}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <CloudOff className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No files found</p>
              <p className="text-sm text-muted-foreground">
                Connect your {activeTab === "google" ? "Google Drive" : "OneDrive"} account to
                import files
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                  />
                  {file.isFolder ? (
                    <Folder className="h-5 w-5 text-blue-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} •{" "}
                      {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
