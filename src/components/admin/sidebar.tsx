"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ClipboardList, FileCheck2, School, Award, LifeBuoy, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/documents", label: "Document Review", icon: FileCheck2 },
  { href: "/admin/institutions", label: "Institutions & Colleges", icon: School },
  { href: "/admin/bursaries", label: "Bursaries", icon: Award },
  { href: "/admin/support", label: "Support Tickets", icon: LifeBuoy },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link href="/admin" className="mb-4 px-2 text-lg font-semibold text-primary">
        EduApply SA <span className="text-xs font-normal text-muted-foreground">Admin</span>
      </Link>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
