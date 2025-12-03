"use client";
import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Spinner } from "../ui/spinner";
import Toaster, { showToast } from "../ui/Toast";
import QuizCard from "../ui/QuizCard";
import { Paperclip, ArrowLeft, ArrowRight } from "lucide-react";
import { getPDFText } from "@/lib/pdf";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizQuestion {
  question: string;
  answer: string;
  choices?: string[];
  options: string[];
}

const Tmain = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [title, setTitle] = useState("");
  const [step, setStep] = useState("input");
  const [choices, setChoices] = useState(5);
  const [loadingMessage, setLoadingMessage] = useState("Generating Quiz...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: "File too large",
        description: "Max 5MB allowed.",
        variant: "error",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      showToast({
        title: "Invalid Format",
        description: "Only PDF files are allowed.",
        variant: "error",
      });
      return;
    }

    setLoadingMessage("Extracting text from PDF...");
    setStep("loading");

    try {
      const [text] = await Promise.all([
        getPDFText(file),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      setNoteText(text);
    } catch (error) {
      console.error("PDF Error", error);
      showToast({
        title: "Error",
        description: "Could not read PDF.",
        variant: "error",
      });
    } finally {
      setStep("input");
      e.target.value = "";
    }
  };
  const [noteText, setNoteText] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [isRestoring, setIsRestoring] = useState(true);
  const [shakeError, setShakeError] = useState(false);
  const range = (start: number, stop: number, step: number = 5) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );

  const choices_num = range(1, 25, 1);

  const handleAnswerSelection = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };
  const handlePrevious = () => {
    if (currentQuestionIndex !== 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
    if (currentQuestionIndex === 1) {
      setPreviousDisabled(true);
    }
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setPreviousDisabled(false);
    } else {
      setStep("result");
    }
  };
  const generateQuiz = async () => {
    if (!noteText.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 1000);
      return;
    }
    setLoadingMessage("Generating Quiz...");
    setStep("loading");
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setPreviousDisabled(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText: noteText, choices: choices }),
      });

      const data = await response.json();

      if (data.success && data.quiz) {
        setQuestions(data.quiz);
        setStep("quiz");
      } else {
        showToast({
          title: "Generation failed",
          variant: "error",
        });
        setStep("input");
      }
    } catch (error) {
      console.error("Network Error:", error);
      showToast({
        title: "Network error",
        description:
          "Could not connect to server. Please check your connection.",
        variant: "error",
      });
      setStep("input");
    }
  };

  useEffect(() => {
    if (step === "quiz" && questions.length > 0) {
      localStorage.setItem(
        "activeQuiz",
        JSON.stringify({
          questions,
          currentQuestionIndex,
          userAnswers,
        })
      );
      localStorage.setItem("activeNoteText", noteText);
    }
  }, [step, questions, currentQuestionIndex, userAnswers, noteText]);

  useEffect(() => {
    const savedData = localStorage.getItem("activeQuiz");
    const savedNote = localStorage.getItem("activeNoteText");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTimeout(() => {
        setQuestions(parsed.questions);
        setCurrentQuestionIndex(parsed.currentQuestionIndex);
        setUserAnswers(parsed.userAnswers);
        if (savedNote) {
          setNoteText(savedNote);
        }
        const totalQuestions = parsed.questions.length;
        const totalAnswers = Object.keys(parsed.userAnswers).length;
        if (totalQuestions > 0 && totalAnswers === totalQuestions) {
          setStep("result");
        } else {
          setStep("quiz");
        }
        setIsRestoring(false);
      }, 0);
    } else {
      setTimeout(() => {
        setStep("input");
        setIsRestoring(false);
      }, 0);
    }
  }, []);

  const handleExit = () => {
    localStorage.removeItem("activeQuiz");
    setStep("input");
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (isRestoring) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white min-w-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-slate-500 animate-pulse">
          Restoring your session...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center bg-slate-50 w-screen">
      <Toaster />
      {step === "input" && (
        <div className="h-screen bg-white w-screen flex flex-col">
          <div className="flex justify-between items-center py-4 px-10 border-b border-slate-50 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Recap<span className="text-purple-600">.ai</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Questions
                </span>
                <Select
                  value={choices.toString()}
                  onValueChange={(val) => setChoices(Number(val))}
                >
                  <SelectTrigger className="w-[60px] h-8 border-none bg-transparent focus:ring-0 text-right p-0 font-semibold text-slate-700">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[180px]">
                    {choices_num.map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button
                variant="outline"
                className="gap-2 border-dashed border-slate-300 text-slate-600"
                onClick={() => fileInputRef.current?.click()} // <--- Triggers the hidden input
              >
                <Paperclip className="w-4 h-4" />
                Upload PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start px-4 md:px-8 overflow-y-auto py-6 min-h-[80vh]">
            <div className="w-full max-w-3xl h-full flex flex-col">
              <div
                className={`flex-1 rounded-2xl bg-white border-2 transition-all duration-300 h-full flex flex-col ${
                  shakeError
                    ? "border-red-500 animate-shake"
                    : "border-slate-100 hover:border-purple-100 shadow-sm hover:shadow-md"
                }`}
              >
                <Textarea
                  placeholder="Paste your notes here to generate a quiz..."
                  className="flex-1 text-lg md:text-xl leading-relaxed text-slate-700 border-none resize-none shadow-none focus-visible:ring-0 p-8 w-full h-full bg-transparent"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2">
            <span className="text-xs text-slate-400 bg-white px-3 py-1 mr-3 mb-1 rounded-full shadow-sm border pointer-events-none select-none">
              {noteText.length} characters
            </span>

            <Button
              className="rounded-full px-8 py-6 text-lg shadow-2xl cursor-pointer"
              onClick={generateQuiz}
            >
              ✨ Generate
            </Button>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="p-6 rounded-lg bg-white shadow-2xl border flex items-center gap-4 animate-in zoom-in duration-300">
            <Spinner />
            <div>
              <div className="font-semibold text-lg">{loadingMessage}</div>
              <div className="text-sm text-slate-500">
                This may take a few seconds...
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div className="max-w-2xl min-w-[50vw] w-full p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>
          <QuizCard
            key={currentQuestionIndex}
            data={questions[currentQuestionIndex]}
            onAnswer={handleAnswerSelection}
            savedAnswer={userAnswers[currentQuestionIndex]}
          />
          <div className="flex justify-between items-center mt-8 w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={previousDisabled}
              className="w-32 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="px-6 cursor-pointer"
                >
                  Exit Quiz
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel your current quiz and you will lose all
                    progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleExit}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              onClick={handleNext}
              className="w-32 text-black"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
      {step === "result" && (
        <div className="max-w-4xl w-full p-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Quiz Complete!
            </h1>
            <p className="text-lg text-slate-600">
              You got{" "}
              <span className="font-bold text-green-600">
                {questions.filter((q, i) => userAnswers[i] === q.answer).length}
              </span>{" "}
              right answers out of {questions.length}
            </p>
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.answer;
              const isSkipped = !userAnswer;

              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSkipped
                      ? "bg-slate-50 border-slate-200"
                      : isCorrect
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 bg-slate-200 text-slate-700">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {question.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {isSkipped && (
                      <span className="px-3 py-1 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full">
                        Skipped
                      </span>
                    )}
                    {isCorrect && (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                        ✓ Correct
                      </span>
                    )}
                    {!isCorrect && !isSkipped && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 ml-12">
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">Your answer: </span>
                      <span
                        className={
                          isSkipped
                            ? "text-slate-500 italic"
                            : isCorrect
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {userAnswer || "Not answered"}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">Correct answer: </span>
                      <span className="text-green-700">{question.answer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-12">
            <Button onClick={handleExit} className="px-12 py-4 text-lg">
              Finish & Go Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tmain;
