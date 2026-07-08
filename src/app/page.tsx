import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, GraduationCap, Search } from "lucide-react";

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

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Every university, college, and bursary application —{" "}
          <span className="text-primary">in one place</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Register once, upload your documents, and let EduApply SA track every
          application for you — from Grade 11 right through to your first year of study.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Create your account</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">I already have an account</Button>
          </Link>
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
