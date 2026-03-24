"use client";

import Link from "next/link";
import {
  FileText,
  Shield,
  Cloud,
  Users,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  Lock,
  BarChart3,
  Search,
  CheckCircle2,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Control de Acceso por Rol",
    description:
      "Sistema de permisos granular con múltiples niveles de rol para acceso seguro a documentos.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Cloud,
    title: "Integración en la Nube",
    description:
      "Conecta con Google Drive, OneDrive y otros proveedores de almacenamiento en la nube.",
    color: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: FileText,
    title: "Gestión Documental",
    description:
      "Sube, organiza, categoriza y comparte documentos con capacidades de búsqueda avanzada.",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    icon: Users,
    title: "Gestión de Usuarios",
    description: "Administra usuarios, asigna roles y controla permisos en toda la institución.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Lock,
    title: "Seguridad Institucional",
    description:
      "Cifrado, trazabilidad completa y manejo de documentos listo para cumplimiento normativo.",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Reportes y Análisis",
    description:
      "Rastrea el uso de documentos, patrones de acceso y genera reportes de cumplimiento.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Search,
    title: "Búsqueda Avanzada",
    description: "Encuentra documentos al instante por nombre, categoría, etiqueta o contenido.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "Registro de Auditoría",
    description:
      "Historial completo de actividades: quién accedió, modificó o compartió cada documento.",
    color: "bg-teal-500/10 text-teal-600",
  },
];

const objetivos = [
  {
    icon: Award,
    title: "Normatividad y Calidad",
    description:
      "Cumplir la normatividad aplicable en materia de Calidad, Medio Ambiente, Seguridad y Salud en el Trabajo.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Target,
    title: "Satisfacción de Usuarios",
    description:
      "Lograr la satisfacción de nuestros usuarios a través de servicios educativos de excelencia y atención oportuna.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Zap,
    title: "Gestión de Energía LITES",
    description:
      "Lograr metas estratégicas para la Gestión de Energía LITES con enfoque en sustentabilidad.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

const partesInteresadas = [
  "Estudiantes",
  "Padres de familia",
  "Personal docente",
  "Personal de Apoyo a la Docencia",
  "Personal Directivo",
  "Egresados",
  "Dependencias de Gobierno del Estado de Oaxaca",
  "Dependencias del Gobierno Federal",
  "Sector productivo y social",
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden />
            </div>
            <span className="text-xl font-bold">SGDE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#mision" className="hover:text-foreground transition-colors">
              Misión
            </a>
            <a href="#objetivos" className="hover:text-foreground transition-colors">
              Objetivos SGI
            </a>
            <a href="#funcionalidades" className="hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#partes-interesadas" className="hover:text-foreground transition-colors">
              Partes Interesadas
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Registrarse</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-nav" className="md:hidden border-t bg-background px-4 py-4">
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Registrarse</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5" />
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="container relative mx-auto px-4 py-24 md:py-36 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground backdrop-blur shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Sistema de Gestión Integral — Grupo Multisitios 3
              </div>
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Sistema de Gestión <span className="text-primary">Documental Educativa</span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Plataforma institucional para la gestión, organización y control de documentos del
                Instituto Tecnológico Superior. Centraliza la información con seguridad,
                trazabilidad y cumplimiento normativo.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/login">
                  <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                    Acceder al Sistema
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-b bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "5", label: "Institutos Tecnológicos" },
                { value: "100%", label: "Normatividad SGI" },
                { value: "ISO", label: "Gestión de Calidad" },
                { value: "Grupo 3", label: "Multisitios" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Misión Section */}
        <section id="mision" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-2xl border bg-card p-10 md:p-14 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-primary" />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Misión Institucional
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                  &ldquo;Ser una Institución de Educación Superior Tecnológica, comprometida en la
                  formación de profesionistas competitivos y capaces de responder a las demandas de
                  miras del entorno, a través de programas educativos de calidad acreditados, con
                  compromiso y responsabilidad Social y Humana de la Sociedad.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Objetivos SGI Section */}
        <section id="objetivos" className="border-t bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                SGI Grupo Multisitios 3
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Objetivos del SGI
              </h2>
              <p className="text-lg text-muted-foreground">
                El Sistema de Gestión Integral orienta su acción hacia tres objetivos estratégicos
                fundamentales.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {objetivos.map((obj, index) => {
                const Icon = obj.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center rounded-xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${obj.color}`}
                    >
                      <Icon className="h-7 w-7" aria-hidden />
                    </div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Objetivo {index + 1}
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{obj.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {obj.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Funcionalidades Section */}
        <section id="funcionalidades" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Funcionalidades del Sistema
              </h2>
              <p className="text-lg text-muted-foreground">
                Una plataforma completa para gestionar los documentos institucionales de forma
                eficiente y segura.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group flex flex-col items-start rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${feature.color}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partes Interesadas Section */}
        <section id="partes-interesadas" className="border-t bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                VIII. Partes Interesadas
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                ¿A quién sirve el SGI?
              </h2>
              <p className="text-lg text-muted-foreground">
                El Sistema de Gestión Integral involucra a todos los actores del ecosistema
                institucional.
              </p>
            </div>

            <div className="mx-auto max-w-4xl grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {partesInteresadas.map((parte, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border bg-card px-5 py-4 shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{parte}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comité Nacional SGI Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                IX. Organigrama
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Comité Nacional del SGI — Grupo 3
              </h2>
              <p className="text-lg text-muted-foreground">
                Estructura organizacional del Comité Nacional de Sistema de Gestión Integral.
              </p>
            </div>

            <div className="mx-auto max-w-2xl flex flex-col items-center gap-3">
              {/* RDN - Top */}
              <div className="w-full max-w-sm rounded-xl border-2 border-primary bg-primary/5 px-6 py-4 text-center shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Nivel Directivo
                </p>
                <p className="font-semibold text-foreground">
                  Representante de la Dirección Nacional (RDN)
                </p>
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Coordinador y Administrador */}
              <div className="w-full grid grid-cols-2 gap-4 max-w-xl">
                {["Coordinador del SGI", "Administrador del SGI"].map((cargo) => (
                  <div
                    key={cargo}
                    className="rounded-lg border bg-card px-4 py-3 text-center shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Coordinación
                    </p>
                    <p className="text-sm font-medium text-foreground">{cargo}</p>
                  </div>
                ))}
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Sitios */}
              <div className="w-full grid grid-cols-2 gap-3">
                {[
                  "Auditor SGI LITES",
                  "Coordinador del SGI ITS",
                  "Coordinador del SGI ITES",
                  "Coordinador del SGI ITES Miahuatlán",
                ].map((cargo) => (
                  <div key={cargo} className="rounded-lg border bg-muted/50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Sitio
                    </p>
                    <p className="text-sm font-medium text-foreground">{cargo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center rounded-2xl border bg-card p-12 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Accede al sistema institucional
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Gestiona la documentación del Instituto Tecnológico Superior de forma segura,
                centralizada y con cumplimiento normativo del SGI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login">
                  <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                    Iniciar Sesión
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden />
                </div>
                <span className="font-semibold">SGDE</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Sistema de Gestión Documental Educativa — SGI Grupo Multisitios 3
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Instituto Tecnológico Superior. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
