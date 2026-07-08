import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, GraduationCap, Search, School } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Find the right fit", body: "Browse and filter universities, TVET colleges, and bursaries by province, faculty, and APS score." },
  { icon: FileText, title: "One document vault", body: "Upload your ID, results, and certificates once, then reuse them across every application." },
  { icon: CheckCircle2, title: "Track everything", body: "See exactly where each application stands, from draft to accepted, in one dashboard." },
  { icon: GraduationCap, title: "Build your CV", body: "Generate a professional CV in minutes with templates designed for first-time applicants." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-primary">EduApply SA</span>
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

      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Every university, college, and bursary application —{" "}
              <span className="text-primary">in one place</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Register once, upload your documents, and let EduApply SA track every
              application for you — from Grade 11 right through to your first year of study.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg">Create your account</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">I already have an account</Button>
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex" style={{ perspective: "1400px" }}>
            <div
              className="relative h-80 w-80 transition-transform duration-500 ease-out hover:[transform:rotateY(-6deg)_rotateX(4deg)]"
              style={{ transformStyle: "preserve-3d", transform: "rotateY(-14deg) rotateX(8deg)" }}
            >
              <div
                className="absolute inset-0 rounded-2xl border border-border bg-card p-6 shadow-elevate-lg"
                style={{ transform: "translateZ(0px)" }}
              >
                <School className="h-7 w-7 text-primary" />
                <p className="mt-4 font-semibold">University of Cape Town</p>
                <p className="text-sm text-muted-foreground">Western Cape · Closes 31 Jul</p>
                <span className="mt-4 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  Submitted
                </span>
              </div>
              <div
                className="absolute inset-0 -translate-x-8 translate-y-10 rounded-2xl border border-border bg-card p-6 shadow-elevate-md"
                style={{ transform: "translateZ(-50px) translateX(-32px) translateY(40px)" }}
              >
                <FileText className="h-7 w-7 text-accent" />
                <p className="mt-4 font-semibold">Matric Certificate</p>
                <p className="text-sm text-muted-foreground">Uploaded · 1.2MB</p>
                <span className="mt-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Approved
                </span>
              </div>
              <div
                className="absolute inset-0 translate-x-10 translate-y-24 rounded-2xl border border-border bg-card p-6 shadow-elevate-sm"
                style={{ transform: "translateZ(-100px) translateX(40px) translateY(96px)" }}
              >
                <GraduationCap className="h-7 w-7 text-primary" />
                <p className="mt-4 font-semibold">Thuthuka Bursary</p>
                <p className="text-sm text-muted-foreground">CA(SA) · Closes 31 Aug</p>
                <span className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-border p-6">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}