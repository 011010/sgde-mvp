"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  Settings,
  FolderOpen,
  Tag,
  GraduationCap,
  Shield,
  ScrollText,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useSession, signOut } from "next-auth/react";
import { MODULE_VISIBILITY } from "@/config/permissions.config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainNavigation = [
  { name: "Panel Principal", href: "/dashboard", icon: Home },
  {
    name: "Documentos",
    href: "/dashboard/documents",
    icon: FileText,
    badge: "Nuevo",
  },
  { name: "Categorías", href: "/dashboard/categories", icon: FolderOpen },
  { name: "Etiquetas", href: "/dashboard/tags", icon: Tag },
];

const preferencesNavigation = [
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

const adminNavigation = [
  {
    name: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Roles",
    href: "/dashboard/roles",
    icon: Shield,
  },
  {
    name: "Registros de Auditoría",
    href: "/dashboard/audit-logs",
    icon: ScrollText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRoles = (session?.user as { roles?: string[] })?.roles || [];

  const canAccess = (href: string): boolean => {
    const allowedRoles = MODULE_VISIBILITY[href];
    if (!allowedRoles) return true;
    return userRoles.some((role) => allowedRoles.includes(role));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    session?.user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">SGDE</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 p-3">
        <div className="mb-2 px-3">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Principal
          </p>
        </div>

        {mainNavigation
          .filter((item) => canAccess(item.href))
          .map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

        {adminNavigation.some((item) => canAccess(item.href)) && (
          <>
            <div className="mt-6 mb-2 px-3">
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                Administración
              </p>
            </div>

            {adminNavigation
              .filter((item) => canAccess(item.href))
              .map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </>
        )}

        <div className="mt-6 mb-4 px-3">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Preferencias
          </p>
        </div>

        {preferencesNavigation
          .filter((item) => canAccess(item.href))
          .map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors group">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-white/15 text-white text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {session?.user?.email || ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 hover:text-red-300 text-sidebar-foreground/60"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
