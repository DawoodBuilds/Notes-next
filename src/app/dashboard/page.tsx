import { Metadata } from "next";
import Tmain from "@/components/dashboard/Tmain";

export const metadata: Metadata = {
  title: "Generate",
};

export default function Workspace() {
  return (
    <div className="flex h-screen bg-white">
      <Tmain />
    </div>
  );
}
