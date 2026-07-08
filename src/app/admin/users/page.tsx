"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/database.types";
import { Search } from "lucide-react";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  province: string | null;
  created_at: string;
};

const ROLE_OPTIONS: UserRole[] = ["student", "parent", "consultant", "admin", "super_admin"];

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, province, created_at")
      .order("created_at", { ascending: false });
    setUsers((data as UserRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateRole(id: string, role: UserRole) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    load();
  }

  const filtered = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground">Loading users…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground">View every registered user and manage staff roles.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or email…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
              <div>
                <p className="font-medium">{u.first_name} {u.last_name}</p>
                <p className="text-sm text-muted-foreground">
                  {u.email} {u.province && `· ${u.province}`} · Joined {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
              <select
                value={u.role}
                onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                className="flex h-9 rounded-md border border-input bg-background px-3 text-sm capitalize"
              >
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No users match your search.</p>
        )}
      </div>
    </div>
  );
}
