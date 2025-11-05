import Link from "next/link";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">SGDE</h1>
          <p className="text-muted-foreground">Sistema de Gestion Documental Educativa</p>
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
  );
}
