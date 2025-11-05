"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentsTable } from "@/components/features/documents/documents-table";

const mockDocuments = [
  {
    id: "1",
    title: "Annual Report 2024",
    fileName: "annual-report-2024.pdf",
    fileSize: 2048576,
    status: "active",
    source: "local",
    createdAt: new Date().toISOString(),
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    title: "Student Handbook",
    fileName: "student-handbook.docx",
    fileSize: 1024000,
    status: "active",
    source: "google_drive",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
  {
    id: "3",
    title: "Budget Proposal 2024",
    fileName: "budget-2024.xlsx",
    fileSize: 512000,
    status: "archived",
    source: "one_drive",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    user: {
      name: "Bob Johnson",
      email: "bob@example.com",
    },
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DocumentsTable documents={mockDocuments} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 3 of 3 documents</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
