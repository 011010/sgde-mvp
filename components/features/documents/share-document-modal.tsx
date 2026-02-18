"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShareDocument } from "@/hooks/use-api";

interface ShareDocumentModalProps {
  documentId: string;
  documentTitle: string;
}

export function ShareDocumentModal({ documentId, documentTitle }: ShareDocumentModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | "admin">("view");
  const [expiresAt, setExpiresAt] = useState("");

  const shareDocument = useShareDocument();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    await shareDocument.mutateAsync({
      documentId,
      sharedWith: email,
      permission,
      expiresAt: expiresAt || undefined,
    });

    setOpen(false);
    setEmail("");
    setPermission("view");
    setExpiresAt("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium">{documentTitle}</p>
            <p className="text-xs text-muted-foreground">Sharing with specific people</p>
          </div>

          <form onSubmit={handleShare} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <Select
                value={permission}
                onValueChange={(value: "view" | "edit" | "admin") => setPermission(value)}
              >
                <SelectTrigger id="permission">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can view</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="admin">Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires (optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no expiration</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={shareDocument.isPending || !email}>
                {shareDocument.isPending ? "Sharing..." : "Share Document"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
