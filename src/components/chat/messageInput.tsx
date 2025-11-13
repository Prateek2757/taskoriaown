"use client";

import React, { useState, useRef } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";

export default function MessageInput({
  onSend,
  onTyping,
}: {
  onSend: (text: string) => void;
  onTyping: () => void;
}) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    onTyping();
    
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
      <div
        className={`flex items-center gap-2 bg-gray-50 rounded-2xl border-2 transition-all duration-300 px-3 py-2 ${
          isFocused
            ? "border-[#6C63FF] bg-white shadow-[0_0_0_3px_rgba(108,99,255,0.1)]"
            : "border-gray-200"
        }`}
      >
        {/* Action Buttons - Left */}
        <button
          type="button"
          className="p-1.5 rounded-full text-gray-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all duration-200 flex-shrink-0"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-1.5 rounded-full text-gray-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all duration-200 flex-shrink-0"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 resize-none focus:outline-none text-[15px] leading-relaxed max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-1"
          style={{ minHeight: "24px" }}
        />

        {/* Send/Voice Button - Right */}
        {input.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            className="p-2 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8A2BE2] text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-md flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 rounded-full text-gray-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all duration-200 flex-shrink-0"
            title="Voice message"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick hint */}
      <div className="mt-1.5 px-1 text-[10px] text-gray-400 text-center">
        Press Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
}