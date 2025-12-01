"use client";
import React from "react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Main = () => {
  type QuizItem = { question: string; options: string[] };
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [isQuizReady, setQuizReady] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [choices, setChoices] = useState(5);
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText: content, choices: choices }),
      });
      const data = await response.json();
      if (data.quiz) {
        setQuiz(data.quiz);
        setQuizReady(true);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-1/2 p-8 border-r border-gray-200 flex flex-col">
        <div className="mb-4">
          <Input
            placeholder="Note Title (e.g. Physics Chap 1)"
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Textarea
          placeholder="Paste your notes here or type them out..."
          className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 text-lg p-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4">
          <Button variant="outline" className="mr-2">
            Upload PDF
          </Button>
        </div>
      </div>
      {!isQuizReady ? (
        <div className="w-1/2 p-8 bg-slate-50 flex flex-col items-center justify-center overflow-auto h-full">
          <div className="text-center text-gray-500">
            <p className="mb-4">No quiz generated yet.</p>
            <div className="flex items-center justify-center gap-3">
              <label className="text-sm text-gray-600">Choices:</label>
              <select
                className="border rounded px-2 py-1"
                value={choices}
                onChange={(e) => setChoices(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <Button
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                onClick={generate}
                disabled={loading}
              >
                {loading ? "Generating..." : "⚡ Generate Quiz"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-1/2 p-8 bg-slate-50 flex flex-col items-start justify-start overflow-auto h-full">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Your Practice Quiz</h2>

            {quiz.map((q, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg mb-4">
                  {index + 1}. {q.question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array.isArray(q.options) &&
                    q.options.map((option: string, i: number) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full whitespace-normal wrap-break-word justify-start text-left h-full"
                      >
                        {option}
                      </Button>
                    ))}
                </div>
              </div>
            ))}

            <Button onClick={() => setQuizReady(false)} variant="outline">
              ← Create Another
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
