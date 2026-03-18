import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { RegisterForm } from "@/components/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
        <div className="max-w-sm text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 mb-6 mx-auto">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join SGDE</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Create your institution&apos;s account and start managing documents securely from day
            one.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              "Free to get started",
              "No credit card required",
              "Full access to all features",
              "Secure and compliant",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold">
                  ✓
                </span>
                {f}
              </div>
            ))}
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

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
