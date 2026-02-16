"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockCategories = [
  {
    id: "1",
    name: "Academic",
    description: "Academic documents and resources",
    color: "#3b82f6",
    documentCount: 15,
  },
  {
    id: "2",
    name: "Administrative",
    description: "Administrative forms and documents",
    color: "#10b981",
    documentCount: 8,
  },
  {
    id: "3",
    name: "Financial",
    description: "Financial reports and budgets",
    color: "#f59e0b",
    documentCount: 12,
  },
  {
    id: "4",
    name: "Human Resources",
    description: "HR documents and policies",
    color: "#8b5cf6",
    documentCount: 5,
  },
  {
    id: "5",
    name: "Legal",
    description: "Legal documents and contracts",
    color: "#ef4444",
    documentCount: 3,
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your documents with categories</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground">{category.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.documentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
