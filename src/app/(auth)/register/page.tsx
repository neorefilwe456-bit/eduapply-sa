"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    firstName: "", lastName: "", idNumber: "", dateOfBirth: "", gender: "",
    mobileNumber: "", email: "", province: "", city: "", address: "",
    password: "", confirmPassword: "",
  });
  const [popiaConsent, setPopiaConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateIdNumber(id: string) {
    // Basic SA ID number check: 13 digits
    return /^\d{13}$/.test(id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.idNumber && !validateIdNumber(form.idNumber)) {
      setError("South African ID numbers must be exactly 13 digits.");
      return;
    }
    if (!popiaConsent) {
      setError("You must accept the privacy policy to continue.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Fill in the rest of the profile fields created by the DB trigger
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          id_number: form.idNumber || null,
          date_of_birth: form.dateOfBirth || null,
          gender: form.gender || null,
          mobile_number: form.mobileNumber,
          province: form.province,
          city: form.city,
          physical_address: form.address,
          popia_consent: true,
        })
        .eq("id", data.user.id);
    }

    setLoading(false);
    router.push("/verify-email");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create your student account</CardTitle>
          <CardDescription>
            Register once to apply to universities, colleges, and bursaries across South Africa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" required value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" required value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="idNumber">SA ID number (or leave blank if using a passport)</Label>
                <Input id="idNumber" maxLength={13} value={form.idNumber}
                  onChange={(e) => update("idNumber", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input id="dateOfBirth" type="date" value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" value={form.gender}
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
                <Label htmlFor="mobileNumber">Mobile number</Label>
                <Input id="mobileNumber" required value={form.mobileNumber}
                  onChange={(e) => update("mobileNumber", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" required value={form.email}
                onChange={(e) => update("email", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <select id="province" required value={form.province}
                  onChange={(e) => update("province", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={form.city}
                  onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Physical address</Label>
              <Input id="address" required value={form.address}
                onChange={(e) => update("address", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={form.password}
                  onChange={(e) => update("password", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" required value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)} />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="popia"
                type="checkbox"
                checked={popiaConsent}
                onChange={(e) => setPopiaConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <Label htmlFor="popia" className="font-normal text-muted-foreground">
                I consent to EduApply SA processing my personal information in line with POPIA
                and the <Link href="/privacy" className="text-primary underline">privacy policy</Link>.
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
