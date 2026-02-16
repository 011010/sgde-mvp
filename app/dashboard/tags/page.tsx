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

const mockTags = [
  {
    id: "1",
    name: "urgent",
    documentCount: 8,
  },
  {
    id: "2",
    name: "confidential",
    documentCount: 15,
  },
  {
    id: "3",
    name: "public",
    documentCount: 25,
  },
  {
    id: "4",
    name: "archived",
    documentCount: 42,
  },
  {
    id: "5",
    name: "draft",
    documentCount: 6,
  },
  {
    id: "6",
    name: "final",
    documentCount: 18,
  },
];

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = mockTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage document tags and labels</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 rounded-full border bg-card px-3 py-1"
              >
                <Badge variant="outline">{tag.name}</Badge>
                <span className="text-xs text-muted-foreground">({tag.documentCount})</span>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <span className="sr-only">Remove</span>×
                </Button>
              </div>
            ))}
          </div>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{tag.name}</Badge>
                  </TableCell>
                  <TableCell>{tag.documentCount}</TableCell>
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
