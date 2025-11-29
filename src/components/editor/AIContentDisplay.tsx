import React from "react";
import { Sparkles, Bug, Lightbulb, RefreshCw, Brain, Type } from "lucide-react";

interface AIContentDisplayProps {
  aiResponse: {
    type: "suggestion" | "bug" | "explanation" | "refactor" | "generation";
    content: string;
  } | null;
}

const AIContentDisplay: React.FC<AIContentDisplayProps> = ({ aiResponse }) => {
  if (!aiResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-400">
        <Brain className="w-12 h-12 mb-4" />
        <p className="text-sm text-center">
          Click any AI button above to get intelligent code analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {aiResponse.type === "suggestion" && (
          <Sparkles className="w-5 h-5 text-blue-400" />
        )}
        {aiResponse.type === "bug" && <Bug className="w-5 h-5 text-red-400" />}
        {aiResponse.type === "explanation" && (
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        )}
        {aiResponse.type === "refactor" && (
          <RefreshCw className="w-5 h-5 text-green-400" />
        )}
        {aiResponse.type === "generation" && (
          <Type className="w-5 h-5 text-indigo-400" />
        )}
        <span className="font-semibold text-white capitalize">
          {aiResponse.type === "suggestion" ? "AI Analysis" : aiResponse.type}
        </span>
      </div>

      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm">
          {aiResponse.content}
        </div>
      </div>
    </div>
  );
};

export default AIContentDisplay;
