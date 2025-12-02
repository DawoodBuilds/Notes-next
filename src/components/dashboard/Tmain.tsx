"use client";
import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Spinner } from "../ui/spinner";
import Toaster, { showToast } from "../ui/Toast";
import QuizCard from "../ui/QuizCard";
import { Paperclip, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { PenLine } from "lucide-react";
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
  const [noteText, setNoteText] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [isRestoring, setIsRestoring] = useState(true);
  const [shakeError, setShakeError] = useState(false);

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
    setStep("loading");
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setPreviousDisabled(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate/", {
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
          {/* 1. Top Navigation / PDF Upload */}
          <div className="flex justify-end items-end p-6 border-b border-slate-100 shrink-0">
            <div className="text-center select-dark center-top">
              <div className="text-transparent bg-clip-text bg-linear-to-br from-purple-600 to-indigo-600 font-extrabold text-3xl md:text-4xl tracking-tight">
                Create Quiz
              </div>
              <div className="text-slate-500 text-sm mt-1">
                Turn your notes into practice questions
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">
                  Questions:
                </span>
                <Select
                  value={choices.toString()}
                  onValueChange={(val) => setChoices(Number(val))}
                >
                  <SelectTrigger className="w-[70px] h-9 border-slate-200 focus:ring-purple-500">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {" "}
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="gap-2 border-dashed border-slate-300 text-slate-600"
              >
                <Paperclip className="w-4 h-4" />
                Upload PDF
              </Button>
            </div>
          </div>

          {/* 2. The Editor Container */}
          <div className="flex-1 flex flex-col items-center justify-start px-6 md:px-12 overflow-y-auto py-8">
            <div className="w-full max-w-4xl">
              {/* Title Input */}
              <div className="w-full max-w-4xl mb-8 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <PenLine size={24} />
                </div>

                <Input
                  placeholder="Name your study set..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-14 pr-4 py-8 text-3xl font-bold text-slate-800 bg-slate-50 border-2 border-transparent rounded-2xl placeholder:text-slate-400 placeholder:font-medium focus-visible:ring-0 focus-visible:border-black focus-visible:bg-white transition-all duration-300 ease-out"
                />
              </div>
              {/* Content Input */}
              <div
                className={`rounded-lg bg-white border-2 shadow-sm hover:shadow-md transition-shadow ${
                  shakeError
                    ? "border-red-500 animate-shake"
                    : "border-slate-200"
                }`}
              >
                <Textarea
                  placeholder="Paste or type your notes here..."
                  className="text-base md:text-lg leading-relaxed text-slate-700 border-none resize-none shadow-none focus-visible:ring-0 p-4 min-h-[50vh] w-full"
                  value={noteText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNoteText(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* 3. The Floating Magic Button */}
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

      {/* STAGE 2: LOADING (Overlay) */}
      {step === "loading" && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center">
          <div className="p-6 rounded-lg bg-white shadow-lg border flex items-center gap-4">
            <Spinner />
            <div>
              <div className="font-semibold">Generating Quiz...</div>
              <div className="text-sm text-slate-500">
                This may take a few seconds — hang tight!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: ONE-BY-ONE QUIZ */}
      {step === "quiz" && (
        <div className="max-w-2xl min-w-[50vw] w-full p-6">
          {/* Progress Bar */}
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

          {/* The Single Card */}
          <QuizCard
            key={currentQuestionIndex}
            data={questions[currentQuestionIndex]}
            onAnswer={handleAnswerSelection}
            savedAnswer={userAnswers[currentQuestionIndex]}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button onClick={handlePrevious} disabled={previousDisabled}>
              <ArrowLeft /> Previous
            </Button>
            <Button onClick={handleNext}>
              Next <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 4: RESULTS */}
      {step === "result" && (
        <div className="max-w-4xl w-full p-6">
          {/* Header */}
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

          {/* Results List */}
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
                  {/* Question */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 bg-slate-200 text-slate-700">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {question.question}
                    </h3>
                  </div>

                  {/* Status Badge */}
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

                  {/* Answers */}
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

          {/* Finish Button */}
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
