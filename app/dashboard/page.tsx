import { FileText, Users, FolderOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Documents",
    value: "2,543",
    description: "+12% from last month",
    icon: FileText,
  },
  {
    title: "Active Users",
    value: "186",
    description: "+3% from last month",
    icon: Users,
  },
  {
    title: "Categories",
    value: "24",
    description: "Across all departments",
    icon: FolderOpen,
  },
  {
    title: "Storage Used",
    value: "45.2 GB",
    description: "68% of 66 GB",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your document management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently uploaded documents in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Annual Report 2024.pdf", date: "2 hours ago" },
                { name: "Student Handbook.docx", date: "5 hours ago" },
                { name: "Budget Proposal.xlsx", date: "1 day ago" },
                { name: "Meeting Minutes.pdf", date: "2 days ago" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent">
                <div className="font-medium">Upload Document</div>
                <div className="text-xs text-muted-foreground">Add new files to the system</div>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent">
                <div className="font-medium">View All Documents</div>
                <div className="text-xs text-muted-foreground">Browse and search documents</div>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent">
                <div className="font-medium">Manage Categories</div>
                <div className="text-xs text-muted-foreground">Organize document categories</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
