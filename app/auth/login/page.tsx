import Link from "next/link";
import { GraduationCap, Shield, Cloud, FileText } from "lucide-react";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">SGDE</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Manage your educational documents with confidence
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Secure, organized, and accessible document management for educational institutions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: "Role-based access control for your institution" },
              { icon: Cloud, text: "Seamless cloud storage integration" },
              { icon: FileText, text: "Advanced document organization and search" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-primary-foreground/90">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} SGDE — Sistema de Gestion Documental Educativa
        </p>
      </div>

      {/* Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only logo */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">SGDE</h1>
            <p className="text-sm text-muted-foreground">Sistema de Gestion Documental Educativa</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
