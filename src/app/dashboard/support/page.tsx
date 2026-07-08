"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
};

export default function SupportPage() {
  const supabase = createClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadTickets() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("support_tickets")
      .select("id, subject, status, created_at")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });
    setTickets((data as Ticket[]) ?? []);
  }

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("support_tickets").insert({
      student_id: user.id,
      subject,
      message,
    });

    setSending(false);

    if (error) {
      setFeedback({ type: "error", text: error.message });
      return;
    }

    setSubject("");
    setMessage("");
    setFeedback({ type: "success", text: "Your ticket has been submitted. We'll get back to you soon." });
    loadTickets();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="text-muted-foreground">Get help with your applications, documents, or account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact us</CardTitle>
          <CardDescription>Send a message and a member of our team will respond by email.</CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <Alert variant={feedback.type === "error" ? "destructive" : "success"} className="mb-6">
              <AlertDescription>{feedback.text}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending…" : "Submit ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
