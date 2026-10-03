// src/app/dashboard/layout.jsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";


export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // login করা না থাকলে
  if (!session) {
    redirect("/login");
  }

  // admin না হলে
  if (session.user.role !== "admin") {
    redirect("/"); // অথবা "/unauthorized"
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}