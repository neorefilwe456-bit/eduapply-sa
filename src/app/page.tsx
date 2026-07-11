import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  School, GraduationCap, Award, Briefcase, FileEdit, ClipboardCheck, ShieldCheck,
  Lock, Users, HeartHandshake, UserPlus, UserCheck, Upload, Send, TrendingUp,
  Mail, Phone, Clock, MapPin, Facebook, Instagram, Linkedin,
} from "lucide-react";

const SERVICES = [
  { icon: School, title: "University Applications", body: "Apply to top universities across South Africa.", color: "primary" as const },
  { icon: GraduationCap, title: "College & TVET Applications", body: "Explore and apply to TVET colleges and private colleges.", color: "blue" as const },
  { icon: Award, title: "Bursary Applications", body: "Find and apply for bursaries that match your profile.", color: "secondary" as const },
  { icon: Briefcase, title: "Internship Applications", body: "Discover internships and gain real work experience.", color: "accent" as const },
  { icon: FileEdit, title: "CV & Cover Letter Writing", body: "Professional CV and cover letter services, done for you.", color: "primary" as const },
  { icon: ClipboardCheck, title: "Application Tracking", body: "Track every application's status in real time, in one place.", color: "blue" as const },
];

const JOURNEY = [
  { step: "1", label: "Register", body: "Create your free student account.", icon: UserPlus },
  { step: "2", label: "Complete Profile", body: "Tell us about yourself and your goals.", icon: UserCheck },
  { step: "3", label: "Upload Documents", body: "Securely upload all required documents.", icon: Upload },
  { step: "4", label: "Apply", body: "Apply to institutions and bursaries.", icon: Send },
  { step: "5", label: "Track Progress", body: "Track your application status in real time.", icon: TrendingUp },
];

const SECURITY = [
  { icon: ShieldCheck, title: "POPIA Compliant", body: "Your privacy is 100% protected." },
  { icon: Lock, title: "Secure Uploads", body: "Bank-level encryption on every document." },
  { icon: Users, title: "Trusted Platform", body: "Used by students across South Africa." },
  { icon: HeartHandshake, title: "Real Human Support", body: "We're here to help you succeed." },
];

const COLOR_MAP: Record<string, { bgSoft: string; text: string; bg: string }> = {
  primary: { bgSoft: "bg-primary/10", text: "text-primary", bg: "bg-primary" },
  blue: { bgSoft: "bg-blue/10", text: "text-blue", bg: "bg-blue" },
  secondary: { bgSoft: "bg-secondary/10", text: "text-secondary", bg: "bg-secondary" },
  accent: { bgSoft: "bg-accent/10", text: "text-accent", bg: "bg-accent" },
};

export default async function HomePage() {
  const supabase = createClient();
  const [{ count: uniCount }, { count: collegeCount }, { count: bursaryCount }] = await Promise.all([
    supabase.from("institutions").select("*", { count: "exact", head: true }).eq("type", "university"),
    supabase.from("institutions").select("*", { count: "exact", head: true }).neq("type", "university"),
    supabase.from("bursaries").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { value: `${uniCount ?? 0}+`, label: "Universities" },
    { value: `${collegeCount ?? 0}+`, label: "Colleges & TVETs" },
    { value: `${bursaryCount ?? 0}+`, label: "Bursaries" },
    { value: "24/7", label: "Student Support" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-base font-bold text-primary">EduApply SA</p>
              <p className="text-[10px] text-muted-foreground">Apply Smarter. Study Sooner.</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            <a href="#services" className="hover:text-foreground">Services</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#how-it-works" className="hover:text-foreground">How It Works</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue opacity-90" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">
              #1 Trusted by Thousands of South African Students
            </span>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
              Apply Smarter.<br />
              <span className="text-accent">Study Sooner.</span>
            </h1>
            <p className="mt-5 max-w-md text-white/85">
              Apply to universities, colleges, TVET institutions, bursaries, and
              internships — all from one secure platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" variant="accent">Apply Now</Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-white/70">
              <ShieldCheck className="h-4 w-4" /> Secure. Reliable. POPIA Compliant.
            </p>
          </div>

          {/* Floating dashboard cards, in place of a licensed photo */}
          <div className="relative hidden h-80 lg:block">
            <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm" />
            <div className="absolute left-4 top-6 w-44 rounded-xl bg-white p-4 text-navy shadow-elevate-lg">
              <p className="text-xs text-muted-foreground">APS Score</p>
              <p className="font-heading text-2xl font-extrabold text-primary">32</p>
            </div>
            <div className="absolute right-4 top-16 w-48 rounded-xl bg-white p-4 text-navy shadow-elevate-lg">
              <p className="text-xs text-muted-foreground">Application Progress</p>
              <p className="font-heading text-xl font-extrabold text-secondary">85% Complete</p>
            </div>
            <div className="absolute bottom-16 left-10 w-44 rounded-xl bg-white p-4 text-navy shadow-elevate-lg">
              <p className="text-xs text-muted-foreground">Documents Uploaded</p>
              <p className="font-heading text-xl font-extrabold text-accent">9/10</p>
            </div>
            <div className="absolute bottom-4 right-6 w-48 rounded-xl bg-white p-4 text-navy shadow-elevate-lg">
              <p className="text-xs text-muted-foreground">Upcoming Deadlines</p>
              <p className="font-heading text-xl font-extrabold text-blue">3 this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-accent">What We Offer</p>
        <h2 className="mt-2 text-center font-heading text-2xl font-bold sm:text-3xl">Everything You Need, All in One Place</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body, color }) => {
            const c = COLOR_MAP[color];
            return (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.bgSoft}`}>
                  <Icon className={`h-5 w-5 ${c.text}`} />
                </div>
                <h3 className="mt-4 font-heading font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-wide text-accent">Pricing</p>
          <h2 className="mt-2 text-center font-heading text-2xl font-bold sm:text-3xl">Simple, Affordable Pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">Pay only for what you need — no subscriptions.</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevate-sm">
              <div className="flex items-center gap-2 bg-primary px-5 py-4 text-white">
                <School className="h-5 w-5" />
                <span className="font-heading font-bold uppercase tracking-wide">University Applications</span>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <span className="text-sm font-medium">1 University</span>
                  <span className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-white">R30</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-4 py-3">
                  <span className="text-sm font-medium">3 Universities + 1 Bursary</span>
                  <span className="rounded-md bg-accent px-3 py-1 text-sm font-bold text-navy">R90</span>
                </div>
                <p className="text-xs text-muted-foreground">Best value — apply to multiple universities and save more.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevate-sm">
              <div className="flex items-center gap-2 bg-secondary px-5 py-4 text-white">
                <Award className="h-5 w-5" />
                <span className="font-heading font-bold uppercase tracking-wide">Bursary Applications</span>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <span className="text-sm font-medium">1 Bursary</span>
                  <span className="rounded-md bg-secondary px-3 py-1 text-sm font-bold text-white">R20</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <span className="text-sm font-medium">Internship Application</span>
                  <span className="rounded-md bg-secondary px-3 py-1 text-sm font-bold text-white">R30</span>
                </div>
                <p className="text-xs text-muted-foreground">Access more funding and work experience opportunities.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevate-sm">
              <div className="flex items-center gap-2 bg-blue px-5 py-4 text-white">
                <FileEdit className="h-5 w-5" />
                <span className="font-heading font-bold uppercase tracking-wide">Career Services</span>
              </div>
              <div className="space-y-2 p-5">
                {[
                  { label: "Career Advice", price: "FREE" },
                  { label: "CV Writing", price: "R30" },
                  { label: "Cover Letter Writing", price: "R40" },
                  { label: "CV + Cover Letter", price: "R50" },
                ].map(({ label, price }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <span className="text-sm">{label}</span>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-bold text-white ${price === "FREE" ? "bg-secondary" : "bg-blue"}`}>
                      {price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-accent">How It Works</p>
        <h2 className="mt-2 text-center font-heading text-2xl font-bold sm:text-3xl">Your Journey, Simplified</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-5">
          {JOURNEY.map(({ step, label, body, icon: Icon }, i) => (
            <div key={step} className="relative text-center">
              {i < JOURNEY.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-px w-full border-t-2 border-dashed border-border sm:block" />
              )}
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-heading text-sm font-bold">{step}. {label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-xl font-bold sm:text-2xl">Your Security. Our Priority.</h2>
          <p className="mt-2 text-center text-sm text-white/70">We protect your data and ensure a secure application process.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-white/70">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <GraduationCap className="h-4 w-4 text-navy" />
              </span>
              <span className="font-heading font-bold">EduApply SA</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Empowering South African students to access quality education and build brighter futures.
            </p>
            <div className="mt-4 flex gap-3">
              <Facebook className="h-4 w-4 text-white/60" />
              <Instagram className="h-4 w-4 text-white/60" />
              <Linkedin className="h-4 w-4 text-white/60" />
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="#services" className="hover:text-white">Universities</a></li>
              <li><a href="#services" className="hover:text-white">Colleges</a></li>
              <li><a href="#pricing" className="hover:text-white">Bursaries</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link href="/register" className="hover:text-white">Get Started</Link></li>
              <li><Link href="/login" className="hover:text-white">Log In</Link></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms & Conditions</span></li>
            </ul>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">Contact Us</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> info@eduapplysa.co.za</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> 060 123 4567</li>
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Mon – Fri, 8:00 AM – 5:00 PM</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> South Africa</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} EduApply SA. All rights reserved. · Placeholder contact details — update in footer before launch.
        </div>
      </footer>
    </main>
  );
}
