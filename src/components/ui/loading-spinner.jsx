// src/components/ui/loading-spinner.jsx
import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

export const AIThinkingIndicator = ({ text = "AI is thinking..." }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
      <div className="relative">
        <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
        <div className="absolute inset-0 w-6 h-6 bg-purple-400 rounded-full blur-md animate-ping opacity-75"></div>
      </div>
      <div>
        <p className="text-purple-900 font-medium">{text}</p>
        <p className="text-xs text-purple-600">This may take a moment...</p>
      </div>
    </div>
  );
};