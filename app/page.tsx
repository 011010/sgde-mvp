"use client";

import Link from "next/link";
import { FileText, Shield, Cloud, Users, Menu, X, ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permission system with multiple role levels for secure document access",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description:
      "Seamlessly connect with Google Drive, OneDrive, and other cloud storage providers",
    color: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: FileText,
    title: "Document Management",
    description:
      "Upload, organize, categorize, and share documents with advanced search capabilities",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Efficiently manage users, assign roles, and control permissions across your organization",
    color: "bg-violet-500/10 text-violet-600",
  },
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
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
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
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
          <div className="container relative mx-auto px-4 py-20 md:py-32 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Trusted by 1000+ Educational Institutions
              </div>
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Sistema de Gestion <span className="text-primary">Documental Educativa</span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Manage your educational institution&apos;s documents efficiently with our modern,
                secure, and scalable document management system.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats Section */}
        <section className="border-t border-b bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "1,000+", label: "Institutions" },
                { value: "2M+", label: "Documents Managed" },
                { value: "50K+", label: "Active Users" },
                { value: "99.9%", label: "Uptime SLA" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">Key Features</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage your educational documents efficiently
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
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Ready to get started?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of educational institutions already using SGDE
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="h-12 px-8">
                  Create your account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden />
              </div>
              <span className="font-semibold">SGDE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SGDE - Sistema de Gestion Documental Educativa. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
