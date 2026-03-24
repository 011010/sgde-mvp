"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/use-api";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const createUser = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser.mutateAsync({ name, email, password });
    setName("");
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleClose = () => {
    if (!createUser.isPending) {
      setName("");
      setEmail("");
      setPassword("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>Add a new user to the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              disabled={createUser.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              disabled={createUser.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Password</Label>
            <div className="relative">
              <Input
                id="create-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                disabled={createUser.isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must contain uppercase, lowercase, and a number.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
