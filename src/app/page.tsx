import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()

  if (!session) {
    redirect("/gym-check")
  }

  if (session.user.role === 'ADMIN') redirect("/admin/dashboard")
  if (session.user.role === 'TRAINER') redirect("/trainer/dashboard")
  redirect("/member/home")
}
