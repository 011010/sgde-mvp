"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Settings, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    toast.info("Cerrando sesión...");
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h2 className="text-lg font-semibold">Bienvenido, {session?.user?.name || "Usuario"}</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tus documentos y archivos eficientemente
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground ring-2 ring-card">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "User"}
                fallback={session?.user?.name?.charAt(0) || "U"}
                className="h-8 w-8"
              />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {session?.user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session?.user?.roles?.[0] || "User"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Perfil
                <Badge variant="secondary" className="ml-auto text-xs">
                  {session?.user?.roles?.[0] || "User"}
                </Badge>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
