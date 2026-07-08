"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  FileText,
  School,
  Building2,
  Award,
  FileEdit,
  CreditCard,
  MessageSquare,
  Bell,
  LifeBuoy,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/documents", label: "My Documents", icon: FileText },
  { href: "/dashboard/applications/university", label: "University Applications", icon: School },
  { href: "/dashboard/applications/college", label: "College Applications", icon: Building2 },
  { href: "/dashboard/applications/bursary", label: "Bursary Applications", icon: Award },
  { href: "/dashboard/cv-builder", label: "CV Builder", icon: FileEdit },
  { href: "/dashboard/payments", label: "Proof of Payment", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link href="/dashboard" className="mb-4 px-2 text-lg font-semibold text-primary">
        EduApply SA
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
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
