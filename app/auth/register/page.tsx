import Link from "next/link";
import { GraduationCap, Users, Tag, BookOpen } from "lucide-react";
import { RegisterForm } from "@/components/features/auth/register-form";

export default function RegisterPage() {
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
              Únete a las instituciones educativas que ya usan SGDE
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Comienza gratis. Sin tarjeta de crédito.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Users, text: "Administra usuarios y roles sin límites" },
              { icon: Tag, text: "Categoriza y etiqueta documentos fácilmente" },
              { icon: BookOpen, text: "Trazabilidad completa para cumplimiento normativo" },
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

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
