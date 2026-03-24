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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    badge: "New",
  },
  { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
  { name: "Tags", href: "/dashboard/tags", icon: Tag },
];

const preferencesNavigation = [{ name: "Settings", href: "/dashboard/settings", icon: Settings }];

const adminNavigation = [
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Roles",
    href: "/dashboard/roles",
    icon: Shield,
  },
  {
    name: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: ScrollText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">SGDE</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 p-3">
        <div className="mb-2 px-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </p>
        </div>

        {mainNavigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", active && "text-primary-foreground")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-6 mb-2 px-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Administration
          </p>
        </div>

        {adminNavigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mr-3", active && "text-primary-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="mt-6 mb-4 px-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Preferences
          </p>
        </div>

        {preferencesNavigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mr-3", active && "text-primary-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors group">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ""}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
