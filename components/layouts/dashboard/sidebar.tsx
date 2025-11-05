"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Users, Settings, FolderOpen, Tag } from "lucide-react";
import { cn } from "@/utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
  { name: "Tags", href: "/dashboard/tags", icon: Tag },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">SGDE</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">SGDE v1.0.0</p>
      </div>
    </div>
  );
}
