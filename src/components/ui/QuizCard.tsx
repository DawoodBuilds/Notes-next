import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./button_temp";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizCardProps {
  data: Question;
  onAnswer: (answer: string) => void;
  savedAnswer?: string;
}

export default function QuizCard({
  data,
  onAnswer,
  savedAnswer,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    savedAnswer || null
  );
  const [isSubmitting, setIsSubmitting] = useState(!!savedAnswer);

  const handleSelect = (option: string) => {
    if (isSubmitting) return;

    setSelectedOption(option);
    setIsSubmitting(true);

    setTimeout(() => {
      onAnswer(option);
    }, 1500);
  };

  const getButtonStyle = (option: string) => {
    if (!isSubmitting) {
      return "hover:border-purple-300 hover:bg-purple-50";
    }
    if (option === data.answer) {
      return "bg-green-500 text-white border-green-600 font-bold shadow-md scale-[1.02]";
    }

    if (option === selectedOption && selectedOption !== data.answer) {
      return "bg-red-500 text-white border-red-600 opacity-90";
    }

    return "opacity-50 bg-slate-50";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-2 border-slate-100 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center text-slate-800 leading-tight">
          {data.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 flex flex-col gap-4">
        {data.options.map((option, index) => (
          <Button
            key={index}
            disabled={isSubmitting}
            variant="outline"
            className={cn(
              "w-full justify-start text-lg py-4 px-6 transition-all duration-300 border-2 whitespace-normal h-auto",
              getButtonStyle(option)
            )}
            onClick={() => handleSelect(option)}
          >
            <span
              className={cn(
                "mr-4 font-bold rounded-md px-3 py-1 text-sm border shrink-0 transition-colors",
                isSubmitting &&
                  (option === data.answer || option === selectedOption)
                  ? "border-white/30 bg-white/20 text-white"
                  : "border-slate-200 bg-slate-100 text-slate-500"
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>

            <span className="text-left">{option}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
