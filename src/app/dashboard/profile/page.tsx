"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

type Profile = {
  first_name: string;
  last_name: string;
  id_number: string | null;
  passport_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  mobile_number: string | null;
  email: string;
  province: string | null;
  city: string | null;
  physical_address: string | null;
};

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data as Profile);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function update<K extends keyof Profile>(key: K, value: string) {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        id_number: profile.id_number,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        mobile_number: profile.mobile_number,
        province: profile.province,
        city: profile.city,
        physical_address: profile.physical_address,
      })
      .eq("id", user.id);

    setSaving(false);
    setMessage(
      error
        ? { type: "error", text: error.message }
        : { type: "success", text: "Profile updated successfully." }
    );
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading your profile…</p>;
  }

  if (!profile) {
    return <p className="text-muted-foreground">Couldn't load your profile.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>Keep your details up to date — this information is used across every application you submit.</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "success"} className="mb-6">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input id="first_name" required value={profile.first_name}
                  onChange={(e) => update("first_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" required value={profile.last_name}
                  onChange={(e) => update("last_name", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id_number">SA ID number</Label>
                <Input id="id_number" maxLength={13} value={profile.id_number ?? ""}
                  onChange={(e) => update("id_number", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of birth</Label>
                <Input id="date_of_birth" type="date" value={profile.date_of_birth ?? ""}
                  onChange={(e) => update("date_of_birth", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" value={profile.gender ?? ""}
                  onChange={(e) => update("gender", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile number</Label>
                <Input id="mobile_number" value={profile.mobile_number ?? ""}
                  onChange={(e) => update("mobile_number", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={profile.email} disabled />
              <p className="text-xs text-muted-foreground">Contact support to change your email address.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <select id="province" value={profile.province ?? ""}
                  onChange={(e) => update("province", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={profile.city ?? ""}
                  onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="physical_address">Physical address</Label>
              <Input id="physical_address" value={profile.physical_address ?? ""}
                onChange={(e) => update("physical_address", e.target.value)} />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
