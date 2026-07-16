import { redirect } from "next/navigation";

// Eski marshrut — endi maqsadlar sahifasiga yo'naltiradi.
export default function DashboardPage() {
  redirect("/goals");
}
