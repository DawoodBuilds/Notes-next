import { Metadata } from "next";
import Main from "@/components/dashboard/Main";
export const metadata: Metadata = {
  title: "Generate",
};

export default function Workspace() {
  return (
    <div className="flex h-screen bg-white">
      <Main />
    </div>
  );
}
