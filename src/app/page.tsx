import DashboardClient from "@/components/dashboard/DashboardClient";

/**
 * Dashboard page — thin server entry point.
 * All interactivity and state live in DashboardClient (client component).
 */
export default function DashboardPage() {
  return <DashboardClient />;
}
