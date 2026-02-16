"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@sgde.local",
    roles: ["super_admin"],
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    roles: ["teacher"],
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    roles: ["coordinator"],
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "4",
    name: "Bob Johnson",
    email: "bob@example.com",
    roles: ["student"],
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "5",
    name: "Alice Williams",
    email: "alice@example.com",
    roles: ["admin"],
    status: "inactive",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const roleColors: Record<string, string> = {
  super_admin: "bg-red-500",
  admin: "bg-orange-500",
  coordinator: "bg-blue-500",
  teacher: "bg-green-500",
  student: "bg-gray-500",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          className={`${roleColors[role] || "bg-gray-500"} text-white`}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
