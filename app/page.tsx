import Link from "next/link";
import { FileText, Shield, Cloud, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/30 bg-[#344E41]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-[#DAD7CD]">
            <FileText className="h-6 w-6 text-[#A3B18A]" aria-hidden />
            <span className="text-xl font-bold">SGDE</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-[#DAD7CD] hover:bg-[#3A5A40] hover:text-[#DAD7CD]"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-[#588157] text-[#DAD7CD] hover:bg-[#3A5A40]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
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
              <Button size="lg" className="bg-[#588157] hover:bg-[#3A5A40]">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-[#588157] text-[#344E41] hover:bg-[#A3B18A]/20 hover:text-[#344E41]"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-border/30 bg-[#A3B18A]/15 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center rounded-xl border border-border/20 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#588157] text-[#DAD7CD]">
                  <Shield className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Granular permission system with multiple role levels
                </p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-border/20 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#588157] text-[#DAD7CD]">
                  <Cloud className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Cloud Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with Google Drive, OneDrive, and more
                </p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-border/20 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#588157] text-[#DAD7CD]">
                  <FileText className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Document Management</h3>
                <p className="text-sm text-muted-foreground">
                  Upload, organize, and share documents easily
                </p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-border/20 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#588157] text-[#DAD7CD]">
                  <Users className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, roles, and permissions efficiently
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/30 bg-[#344E41] py-6">
        <div className="container mx-auto px-4 text-center text-sm text-[#DAD7CD]">
          <p>SGDE - Sistema de Gestion Documental Educativa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
