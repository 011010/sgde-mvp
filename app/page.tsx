import Link from "next/link";
import { FileText, Shield, Cloud, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">SGDE</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Sistema de Gestion
            <br />
            Documental Educativa
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Manage your educational institution&apos;s documents efficiently with our modern,
            secure, and scalable document management system.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/40 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Granular permission system with multiple role levels
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cloud className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Cloud Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with Google Drive, OneDrive, and more
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Document Management</h3>
                <p className="text-sm text-muted-foreground">
                  Upload, organize, and share documents easily
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, roles, and permissions efficiently
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SGDE - Sistema de Gestion Documental Educativa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
