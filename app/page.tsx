"use client";

import Link from "next/link";
import { Menu, X, ChevronRight, GraduationCap, Target, Award, Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const integrantes = [
  {
    nombre: "Instituto Tecnológico Superior de Rioverde",
    domicilio:
      "Carretera Rioverde - San Ciro Km 4.5 S/N, María del Rosario, Rioverde, San Luis Potosí, CP 79610",
    logo: "/LOGO ITSRV-01-1.png",
  },
  {
    nombre: "Instituto Tecnológico de Estudios Superiores de Los Cabos",
    domicilio:
      "Boulevard Tecnológico de los Cabos S/N, Guayamitas, San José del Cabo, Baja California Sur, CP 23407",
    logo: "/logotipo ITES fondo Blanco.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Champotón",
    domicilio: "Carretera Champotón - Isla Aguada Km. 2, El Arenal, Champotón, Campeche, CP 24400",
    logo: "/LOGO COLOR 1LOGO ORIGINAL ITESCHAM.svg",
  },
  {
    nombre: "Instituto Tecnológico Superior de Costa Chica",
    domicilio: "Carretera Ometepec Igualapa Km. 1, Talapa, Ometepec, Guerrero, CP 41706",
    logo: "/ITSCCH.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Tierra Blanca",
    domicilio: "Avenida Veracruz S/N, Col. Pemex, Tierra Blanca, Veracruz, CP 95180",
    logo: "/itstb.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Zacatecas Norte",
    domicilio: "Carretera a González Ortega Km 3, Ap 178 S/N, Rio Grande, Zacatecas, CP 98400",
    logo: "/itszn.webp",
  },
  {
    nombre: "Instituto Tecnológico Superior de Cosamaloapan",
    domicilio: "Av. Tecnológico S/N, Los Ángeles, Cosamaloapan, Veracruz, CP 95400",
    logo: "/LOGO VECTORIZADO TEC COSAMA SIN FONDO.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Mulegé",
    domicilio: "Loma los Frailes S/N, Centro, Santa Rosalía Mulegé, Baja California Sur, CP 23920",
    logo: "/mulege.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de San Luis Potosí Capital",
    domicilio:
      "Carretera 57 México - Piedras Negras Km. 189 + 100, No. 6501, Villa de Pozos, Qro., San Luis Potosí, CP 7842",
    logo: "/logotipo-del-tecnologico-de-san-luis-potosi-1024x576.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Fresnillo",
    domicilio: "Av. Tecnológico No. 2000, Solidaridad, Fresnillo, Zacatecas, CP 99010",
    logo: "/itse.png",
  },
  {
    nombre: "Tecnológico de Estudios Superiores de Chalco",
    domicilio:
      "Carretera Federal México-Cuautla s/n, Col. La Candelaria Tlapana, Chalco, Estado de México, CP 5664",
    logo: "/Logo-TESCHA.jpg",
  },
  {
    nombre: "Instituto Tecnológico Superior de Huauchinango",
    domicilio: "Avenida Tecnológico No. 80, 5 de Octubre, Huauchinango, Puebla, CP 73160",
    logo: "/techuachi.jpg",
  },
  {
    nombre: "Instituto Tecnológico Superior de Teposcolula",
    domicilio: "Avenida Tecnológico #1, San Pedro y San Pablo Teposcolula, Oaxaca, CP 69500",
    logo: "/logo-itste.jpeg",
  },
  {
    nombre: "Instituto Tecnológico Superior de Zacatecas Occidente",
    domicilio: "Av. Tecnológico número 2000, Col. Loma La Perla, Sombrerete, Zacatecas, CP 99102",
    logo: "/LOGOCHICO.png",
  },
  {
    nombre: "Instituto Tecnológico Superior del Álamo",
    domicilio: "Km 6.5 Carretera Potrero del Llano - Tuxpan, Xoyotitla, Veracruz, CP 92730",
    logo: "/Escudo ITSAT Uso 2026.png",
  },
  {
    nombre: "Instituto Tecnológico Superior de Naranjos",
    domicilio: "C. Priv. Guanajuato S/N, Manuel Ávila Camacho, Naranjos, Veracruz, CP 92370",
    logo: "/OIP.webp",
  },
  {
    nombre: "Instituto Tecnológico Superior de Tlatlauquitepec",
    domicilio:
      "Carretera Federal Amozoc-Nautla Km. 122+600 Almoloni Tlatlauquitepec, Pue., Teziutlán-Acajete, 73907 Pue.",
    logo: "/ACORAZADO LOGO.png",
  },
  {
    nombre: "Tecnológico de Estudios Superiores de Huixquilucan",
    domicilio: "Barrio El Río s/n, 52773 Magdalena Chichicaspa, Méx.",
    logo: "/TEScolor.jpg",
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
          <Link href="/" className="flex items-center gap-3">
            <img src="/tecnm-logo.png" alt="TecNM" className="h-10 w-auto object-contain" />
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
            <a href="#integrantes" className="hover:text-foreground transition-colors">
              Integrantes
            </a>
            <a href="#partes-interesadas" className="hover:text-foreground transition-colors">
              Partes Interesadas
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
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

        {/* Integrantes Section */}
        <section id="integrantes" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Grupo Multisitios 3
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Institutos Integrantes
              </h2>
              <p className="text-lg text-muted-foreground">
                Los 18 Institutos Tecnológicos Superiores que conforman el Grupo 3 del SGI.
              </p>
            </div>

            <div className="mx-auto max-w-5xl grid gap-3 md:grid-cols-2">
              {integrantes.map((inst, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border bg-card px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 mt-0.5">
                    {inst.logo ? (
                      <img
                        src={inst.logo}
                        alt={inst.nombre}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <div className="flex w-8 h-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{inst.nombre}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                      {inst.domicilio}
                    </p>
                  </div>
                </div>
              ))}
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

            <div className="mx-auto max-w-3xl flex flex-col items-center gap-0">
              {/* Nivel 1: Director(a) de ITD's */}
              <div className="w-full max-w-sm rounded-xl border-2 border-primary bg-primary/5 px-6 py-4 text-center shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Nivel 1
                </p>
                <p className="font-semibold text-foreground">Director(a) de ITD&apos;s</p>
              </div>

              <div className="w-px h-6 bg-border" />

              {/* Nivel 2: RDN + Director(a) de ITS */}
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-0">
                  <div className="w-full rounded-lg border-2 border-primary/50 bg-primary/5 px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Nivel 2
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Representante de la Dirección Nacional (RDN)
                    </p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  {/* Nivel 3: Coordinador Nacional del G3 */}
                  <div className="w-full rounded-lg border bg-card px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Nivel 3
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Coordinador Nacional del G3
                    </p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  {/* Nivel 4: bajo Coordinador Nacional */}
                  <div className="w-full flex flex-col gap-2">
                    {[
                      "Auditor(a) Líder Nacional del G3",
                      "Controlador(a) Operacional Nacional del G3",
                      "Controlador(a) de Información Documentada del G3",
                    ].map((cargo) => (
                      <div
                        key={cargo}
                        className="rounded-lg border bg-muted/50 px-3 py-2 text-center"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Nivel 4
                        </p>
                        <p className="text-xs font-medium text-foreground">{cargo}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0">
                  <div className="w-full rounded-lg border-2 border-primary/50 bg-primary/5 px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Nivel 2
                    </p>
                    <p className="text-sm font-medium text-foreground">Director(a) de ITS</p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  {/* Nivel 4: Administrador(a) del SGI del ITS */}
                  <div className="w-full rounded-lg border bg-card px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Nivel 4
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Administrador(a) del SGI del ITS
                    </p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  {/* Nivel 5: Controlador(a) de Información Documentada del ITS */}
                  <div className="w-full rounded-lg border bg-muted/50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Nivel 5
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      Controlador(a) de Información Documentada del ITS
                    </p>
                  </div>
                </div>
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
