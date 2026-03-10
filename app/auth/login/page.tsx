import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
        <div className="max-w-sm text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 mb-6 mx-auto">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">SGDE</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            The platform trusted by educational institutions for secure, efficient document
            management.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {["Role-based access", "Cloud integrations", "Audit logs", "Secure sharing"].map(
              (f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
                  {f}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-3">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">SGDE</h1>
            <p className="text-sm text-muted-foreground">
              Sistema de Gestión Documental Educativa
            </p>
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
