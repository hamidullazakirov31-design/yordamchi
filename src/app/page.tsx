import { redirect } from "next/navigation";

export default function Home() {
  // Bosh sahifa dashboard'ga yo'naltiradi; middleware sessiyani tekshiradi.
  redirect("/dashboard");
}
