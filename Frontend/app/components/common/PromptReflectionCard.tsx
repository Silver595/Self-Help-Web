import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PromptReflectionCardProps {
  category?: string;
  code?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
}

/**
 * PromptReflectionCard - A reusable interactive card component featuring an orange border,
 * a reflection prompt question, subtitle, and an inline input field with a submit action.
 */
export default function PromptReflectionCard({
  category = "OPTIONAL REFLECTION",
  code = "085 / 07",
  title = "WHAT FELT A LITTLE EASIER TODAY?",
  subtitle = "Start with one sentence. You can always return later.",
  placeholder = "Begin writing...",
  onSubmit = () => {},
  className = "",
}: PromptReflectionCardProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue("");
    }
  };

  return (
    <div
      className={`relative rounded-2xl border-2 border-[#ff3d00]/80 bg-[#fbfbf9] p-7 shadow-[0_8px_20px_-6px_rgba(255,61,0,0.1)] font-mono ${className}`}
    >
      {/* Top Header Row (Category & Code) */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-bold tracking-widest text-[#ff3d00]">
        <span>{category}</span>
        <span>{code}</span>
      </div>

      {/* Main Prompt Question Heading */}
      <h3 className="font-sans text-2xl font-extrabold tracking-tight text-neutral-900 mb-2">
        {title}
      </h3>

      {/* Subtitle / Helper Instruction */}
      <p className="font-sans text-xs text-neutral-500 mb-6">
        {subtitle}
      </p>

      {/* Interactive Input Container */}
      <div className="flex items-center justify-between rounded-xl bg-transparent px-4 py-3 transition-all focus-within:border border-[#ff3d00]">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="w-full bg-transparent text-[12px] font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          aria-label="Submit reflection"
          className="text-[#ff3d00] hover:translate-x-1 transition-transform cursor-pointer pl-3"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}