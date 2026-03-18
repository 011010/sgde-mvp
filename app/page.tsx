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
} from "lucide-react";
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
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "End-to-end encryption, audit trails, and compliance-ready document handling",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Track document usage, access patterns, and generate compliance reports with ease",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description:
      "Instantly find documents by name, category, tag, or content across your entire library",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "Audit Logs",
    description:
      "Complete activity trails for every action — who accessed, modified, or shared each document",
    color: "bg-teal-500/10 text-teal-600",
  },
];

const stats = [
  { value: "1,000+", label: "Institutions" },
  { value: "2M+", label: "Documents managed" },
  { value: "50K+", label: "Active users" },
  { value: "99.9%", label: "Uptime SLA" },
];

const howItWorks = [
  {
    step: "1",
    title: "Create your account",
    description: "Sign up for free and set up your institution in minutes.",
  },
  {
    step: "2",
    title: "Invite your team",
    description: "Add users and assign roles — teachers, coordinators, admins.",
  },
  {
    step: "3",
    title: "Upload & organize",
    description: "Upload documents and organize them by categories and tags.",
  },
  {
    step: "4",
    title: "Share securely",
    description: "Control exactly who can view, edit, or download each file.",
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
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          </nav>

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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5" />
          {/* Decorative circles */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="container relative mx-auto px-4 py-24 md:py-36 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground backdrop-blur shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Trusted by 1,000+ Educational Institutions
              </div>
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Sistema de Gestión{" "}
                <span className="text-primary">Documental Educativa</span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                The modern, secure, and scalable document management platform built specifically
                for educational institutions. Manage, share, and organize documents — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Sign In to Dashboard
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
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground">
                A complete platform to manage your institution&apos;s documents efficiently and securely
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
                    <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t bg-muted/50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Get started in minutes
              </h2>
              <p className="text-lg text-muted-foreground">
                Simple setup, powerful results. No technical expertise required.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg shadow-primary/20">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center rounded-2xl border bg-card p-12 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
                Ready to transform your document management?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of educational institutions already using SGDE to manage their documents efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                    Create your free account
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Sign in
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
                Sistema de Gestión Documental Educativa
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} SGDE. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
