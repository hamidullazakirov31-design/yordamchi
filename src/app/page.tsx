import { redirect } from "next/navigation";

export default function Home() {
  // Bosh sahifa maqsadlar sahifasiga yo'naltiradi; layout/middleware sessiyani tekshiradi.
  redirect("/goals");
}
