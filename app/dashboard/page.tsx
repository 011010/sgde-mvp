"use client";

import Link from "next/link";
import {
  FileText,
  Users,
  FolderOpen,
  Tag,
  ArrowUpRight,
  Upload,
  Search,
  Tags,
  Activity,
  HardDrive,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments, useUsers, useCategories, useTags, useAuditLogs } from "@/hooks/use-api";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  loading?: boolean;
  color?: string;
  href?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  color = "bg-primary/10 text-primary",
  href,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  const card = (
    <Card className="transition-all duration-300 hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={`rounded-lg p-2 transition-transform duration-200 group-hover:scale-110 ${color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }
  return card;
}

const quickActions = [
  {
    title: "Subir Documento",
    description: "Agregar nuevos archivos al sistema",
    icon: Upload,
    href: "/dashboard/documents?action=upload",
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20",
  },
  {
    title: "Explorar Documentos",
    description: "Buscar y ver todos los documentos",
    icon: Search,
    href: "/dashboard/documents",
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20",
  },
  {
    title: "Gestionar Categorías",
    description: "Organizar categorías de documentos",
    icon: Tags,
    href: "/dashboard/categories",
    color: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20",
  },
  {
    title: "Ver Registros de Auditoría",
    description: "Revisar la actividad del sistema",
    icon: Activity,
    href: "/dashboard/audit-logs",
    color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20",
  },
];

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-600",
  DOCX: "bg-blue-500/10 text-blue-600",
  DOC: "bg-blue-500/10 text-blue-600",
  XLSX: "bg-green-500/10 text-green-600",
  XLS: "bg-green-500/10 text-green-600",
  PPTX: "bg-orange-500/10 text-orange-600",
  PPT: "bg-orange-500/10 text-orange-600",
  PNG: "bg-purple-500/10 text-purple-600",
  JPG: "bg-purple-500/10 text-purple-600",
  JPEG: "bg-purple-500/10 text-purple-600",
};

export default function DashboardPage() {
  const { data: documentsData, isLoading: docsLoading } = useDocuments({ limit: 5, page: 1 });
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 1, page: 1 });
  const { data: categoriesData, isLoading: catsLoading } = useCategories({ limit: 1, page: 1 });
  const { data: tagsData, isLoading: tagsLoading } = useTags({ limit: 1, page: 1 });
  const { data: auditData, isLoading: auditLoading } = useAuditLogs({ limit: 5, page: 1 });

  const totalDocuments = documentsData?.data?.pagination?.total ?? 0;
  const totalUsers = usersData?.data?.pagination?.total ?? 0;
  const totalCategories = categoriesData?.data?.pagination?.total ?? 0;
  const totalTags = tagsData?.data?.pagination?.total ?? 0;
  const recentDocuments = documentsData?.data?.documents ?? [];
  const recentLogs = auditData?.data?.logs ?? [];

  const statsLoading = docsLoading || usersLoading || catsLoading || tagsLoading;

  const stats = [
    {
      title: "Total de Documentos",
      value: totalDocuments.toLocaleString(),
      description: "En todas las categorías",
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20",
      href: "/dashboard/documents",
    },
    {
      title: "Usuarios Activos",
      value: totalUsers.toLocaleString(),
      description: "Registrados en el sistema",
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20",
      href: "/dashboard/users",
    },
    {
      title: "Categorías",
      value: totalCategories.toLocaleString(),
      description: "Colecciones de documentos",
      icon: FolderOpen,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20",
      href: "/dashboard/categories",
    },
    {
      title: "Etiquetas",
      value: totalTags.toLocaleString(),
      description: "Etiquetas disponibles",
      icon: Tag,
      color: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20",
      href: "/dashboard/tags",
    },
  ];

  const actionColors: Record<string, string> = {
    create: "bg-green-500/10 text-green-700",
    update: "bg-blue-500/10 text-blue-700",
    delete: "bg-red-500/10 text-red-700",
    share: "bg-purple-500/10 text-purple-700",
    download: "bg-yellow-500/10 text-yellow-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-muted-foreground">Resumen del sistema de gestión documental</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={statsLoading} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Documents */}
        <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Documentos Recientes</CardTitle>
              <CardDescription>Archivos subidos recientemente</CardDescription>
            </div>
            <Link href="/dashboard/documents">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {docsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded" />
                      <div>
                        <Skeleton className="h-4 w-36 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">Sin documentos aún</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sube tu primer documento para comenzar
                </p>
                <Link href="/dashboard/documents?action=upload">
                  <Button size="sm" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Documento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((doc) => {
                  const ext = doc.fileName?.split(".").pop()?.toUpperCase() || "FILE";
                  const colorClass = fileTypeColors[ext] || "bg-gray-500/10 text-gray-600";
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between group cursor-pointer rounded-lg p-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${colorClass}`}
                        >
                          {ext.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {doc.title || doc.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.fileSize
                              ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`
                              : "Unknown size"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-3">
                        {new Date(doc.createdAt).toLocaleDateString("es-MX", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes y accesos directos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:bg-accent hover:shadow-sm"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {action.title}
                      </div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones del sistema</CardDescription>
          </div>
          <Link href="/dashboard/audit-logs">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {auditLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="py-8 text-center">
              <HardDrive className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {log.user.name?.[0]?.toUpperCase() || log.user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{log.user.name || log.user.email}</span>
                      <Badge
                        className={`text-xs ${actionColors[log.action] || "bg-gray-500/10 text-gray-700"}`}
                        variant="outline"
                      >
                        {log.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground capitalize">
                        {log.resource.replace("_", " ")}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.details}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.createdAt).toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
