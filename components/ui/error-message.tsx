"use client";

import { motion } from "framer-motion";

interface ErrorMessageProps {
  title?: string;
  message: string;
  suggestion?: string;
  icon?: "error" | "warning" | "info";
}

export function ErrorMessage({
  title,
  message,
  suggestion,
  icon = "error",
}: ErrorMessageProps) {
  const icons = {
    error: (
      <svg
        className="h-5 w-5 text-red-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className="h-5 w-5 text-yellow-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg
        className="h-5 w-5 text-blue-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const bgColors = {
    error: "bg-red-50",
    warning: "bg-yellow-50",
    info: "bg-blue-50",
  };

  const textColors = {
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg p-4 ${bgColors[icon]} shake`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icons[icon]}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${textColors[icon]} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${textColors[icon]}`}>{message}</div>
          {suggestion && (
            <div className={`mt-2 text-sm ${textColors[icon]} opacity-90`}>
              💡 <span className="font-medium">Suggestion:</span> {suggestion}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
