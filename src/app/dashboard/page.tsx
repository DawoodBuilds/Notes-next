import { Metadata } from "next";
import Tmain from "@/components/dashboard/Tmain";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Workspace() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return (
    <div className="flex h-screen bg-white">
      <Tmain />
    </div>
  );
}
