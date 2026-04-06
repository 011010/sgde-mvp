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
          <span className="text-2xl font-bold">SGDI</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Gestiona los documentos educativos con confianza
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Gestión documental segura, organizada y accesible para instituciones educativas.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: "Control de acceso por rol para tu institución" },
              { icon: Cloud, text: "Integración con almacenamiento en la nube" },
              { icon: FileText, text: "Organización avanzada de documentos y búsqueda" },
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
          &copy; {new Date().getFullYear()} SGDI — Sistema de Gestion Documental Integral
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
            <h1 className="text-2xl font-bold">SGDI</h1>
            <p className="text-sm text-muted-foreground">Sistema de Gestion Documental Integral</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
