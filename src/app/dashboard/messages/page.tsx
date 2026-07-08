import { ComingSoon } from "@/components/dashboard/coming-soon";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <ComingSoon
      icon={MessageSquare}
      title="Messages"
      description="Direct messages between you and the consultant assigned to your applications."
      phase="a later phase"
    />
  );
}
