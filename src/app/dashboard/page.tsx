import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  // Placeholder data (We will replace this with Database data later)
  const notes = [
    { id: 1, title: "Biology: Cells", date: "2 days ago" },
    { id: 2, title: "Chemistry Formulae", date: "1 week ago" },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">My Study Sets</h1>
        <Link href="/dashboard/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            + Create New
          </Button>
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1: Create New (Visual Shortcut) */}
        <Link
          href="/dashboard/new"
          className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition cursor-pointer bg-white"
        >
          <span className="font-semibold">Create New Set</span>
        </Link>

        {/* Existing Notes Loop */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer h-48 flex flex-col justify-between"
          >
            <h3 className="font-bold text-xl text-gray-800">{note.title}</h3>
            <p className="text-sm text-gray-400">Created {note.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
