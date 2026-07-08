import { ComingSoon } from "@/components/dashboard/coming-soon";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Proof of Payment"
      description="View banking details and upload proof of payment for your applications."
      phase="a later phase"
    />
  );
}
