"use client";

import Link from "next/link";
import {
  FileText,
  Users,
  FolderOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Search,
  Tags,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
  color?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  trendValue,
  loading,
  color = "bg-primary/10 text-primary",
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trendValue && (
            <Badge
              variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3" />}
              {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3" />}
              {trendValue}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

const recentDocuments = [
  { name: "Annual Report 2024.pdf", date: "2 hours ago", size: "2.4 MB", type: "PDF" },
  { name: "Student Handbook.docx", date: "5 hours ago", size: "1.8 MB", type: "DOCX" },
  { name: "Budget Proposal.xlsx", date: "1 day ago", size: "856 KB", type: "XLSX" },
  { name: "Meeting Minutes.pdf", date: "2 days ago", size: "450 KB", type: "PDF" },
];

const quickActions = [
  {
    title: "Upload Document",
    description: "Add new files to the system",
    icon: Upload,
    href: "/dashboard/documents?action=upload",
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20",
  },
  {
    title: "Browse Documents",
    description: "Search and view all documents",
    icon: Search,
    href: "/dashboard/documents",
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20",
  },
  {
    title: "Manage Categories",
    description: "Organize document categories",
    icon: Tags,
    href: "/dashboard/categories",
    color: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Total Documents",
      value: "2,543",
      description: "Across all categories",
      icon: FileText,
      trend: "up" as const,
      trendValue: "+12%",
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20",
    },
    {
      title: "Active Users",
      value: "186",
      description: "Currently online",
      icon: Users,
      trend: "up" as const,
      trendValue: "+3%",
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20",
    },
    {
      title: "Categories",
      value: "24",
      description: "Organized collections",
      icon: FolderOpen,
      trend: "neutral" as const,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20",
    },
    {
      title: "Storage Used",
      value: "45.2 GB",
      description: "68% of 66 GB limit",
      icon: TrendingUp,
      trend: "down" as const,
      trendValue: "-5%",
      color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your documents.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Documents */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Recently uploaded files</CardDescription>
            </div>
            <Link href="/dashboard/documents">
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <button className="w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all duration-200 hover:bg-accent hover:shadow-sm group">
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
                    </button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
