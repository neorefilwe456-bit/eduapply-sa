import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  ShieldCheck, Clock, Handshake, Target, GraduationCap, Landmark, Award, Briefcase,
  MessageSquare, FileEdit, Mail, FileCheck2, Sparkles, Users, BadgeCheck, Star, Heart,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Simple & Secure" },
  { icon: Clock, label: "Save Time & Effort" },
  { icon: Handshake, label: "Expert Guidance" },
  { icon: Target, label: "Better Opportunities" },
];

const CAREER_SERVICES = [
  { label: "Career Advice", price: "FREE", icon: MessageSquare },
  { label: "Internship Applications", price: "R30", icon: Briefcase },
  { label: "CV Writing", price: "R30", icon: FileEdit },
  { label: "Cover Letter Writing", price: "R40", icon: Mail },
  { label: "CV + Cover Letter", price: "R50", icon: FileCheck2 },
];

const BOTTOM_STRIP = [
  { icon: Users, label: "For Matriculants, Students & Graduates", color: "bg-accent" },
  { icon: BadgeCheck, label: "Fast, Reliable & Affordable Services", color: "bg-secondary" },
  { icon: Star, label: "Thousands of Students Closer to Their Dreams Every Year", color: "bg-purple" },
  { icon: Heart, label: "We Care About Your Success", color: "bg-primary" },
];

export default async function HomePage() {
  const supabase = createClient();
  const [{ count: uniCount }, { count: collegeCount }, { count: bursaryCount }] = await Promise.all([
    supabase.from("institutions").select("*", { count: "exact", head: true }).eq("type", "university"),
    supabase.from("institutions").select("*", { count: "exact", head: true }).neq("type", "university"),
    supabase.from("bursaries").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { value: uniCount ?? 0, label: "Universities listed" },
    { value: collegeCount ?? 0, label: "Colleges & TVETs listed" },
    { value: bursaryCount ?? 0, label: "Bursaries & scholarships" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-1 font-heading text-xl font-extrabold">
            <GraduationCap className="mr-1 h-6 w-6 text-navy" />
            <span className="text-navy">EDU</span>
            <span className="text-primary">APPLY</span>
            <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-navy">SA</span>
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center lg:pt-24">
        <h1 className="font-script text-4xl text-navy sm:text-5xl">
          Apply Smarter. <span className="text-primary">Study Sooner.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-foreground">
          Your trusted partner for university applications, bursaries, and career success.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Create your account</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">I already have an account</Button>
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-4">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium text-navy">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 shadow-elevate-sm sm:p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Services */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-2 text-center font-heading text-2xl font-bold sm:text-3xl">Our Services</h2>
        <p className="mb-10 text-center text-muted-foreground">Simple, affordable pricing — pay only for what you need.</p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* University Applications */}
          <div className="overflow-hidden rounded-xl border border-border shadow-elevate-sm">
            <div className="flex items-center gap-2 bg-navy px-5 py-4 text-white">
              <Landmark className="h-5 w-5" />
              <span className="font-heading font-bold uppercase tracking-wide">University Applications</span>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-sm font-medium">1 University</span>
                <span className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-white">R30</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-4 py-3">
                <span className="text-sm font-medium">3 Universities + 1 Bursary</span>
                <span className="flex items-center gap-1 rounded-md bg-accent px-3 py-1 text-sm font-bold text-navy">
                  R90 <Star className="h-3 w-3 fill-navy" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Best value — apply to multiple universities and save more.</p>
            </div>
          </div>

          {/* Bursary Applications */}
          <div className="overflow-hidden rounded-xl border border-border shadow-elevate-sm">
            <div className="flex items-center gap-2 bg-secondary px-5 py-4 text-white">
              <Award className="h-5 w-5" />
              <span className="font-heading font-bold uppercase tracking-wide">Bursary Applications</span>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-sm font-medium">1 Bursary</span>
                <span className="rounded-md bg-secondary px-3 py-1 text-sm font-bold text-white">R20</span>
              </div>
              <p className="rounded-lg bg-secondary/10 p-3 text-xs text-muted-foreground">
                Access more funding opportunities and secure your future.
              </p>
            </div>
          </div>

          {/* Career Services */}
          <div className="overflow-hidden rounded-xl border border-border shadow-elevate-sm">
            <div className="flex items-center gap-2 bg-purple px-5 py-4 text-white">
              <Briefcase className="h-5 w-5" />
              <span className="font-heading font-bold uppercase tracking-wide">Career Services</span>
            </div>
            <div className="space-y-2 p-5">
              {CAREER_SERVICES.map(({ label, price, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-purple" /> {label}
                  </span>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold text-white ${price === "FREE" ? "bg-secondary" : "bg-purple"}`}>
                    {price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dreams banner */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-navy px-8 py-10 text-center text-white sm:flex-row sm:text-left">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent">
            <GraduationCap className="h-8 w-8 text-navy" />
          </span>
          <div>
            <p className="font-script text-2xl text-accent sm:text-3xl">
              We're here to help you achieve your dreams!
            </p>
            <p className="mt-1 text-sm text-white/80">
              From applications to career success, we've got you covered every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom trust strip */}
      <footer className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {BOTTOM_STRIP.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-white`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-white/90">{label}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
          <Sparkles className="mx-auto mb-2 h-4 w-4 text-accent" />
          © {new Date().getFullYear()} EduApply SA. All rights reserved.
        </div>
      </footer>
    </main>
  );
}