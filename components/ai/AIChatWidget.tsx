"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Which scholarships suit me?",
  "How do I compress a PDF?",
  "NSP OBC deadline?",
  "SOP tips for first-gen",
];

const GREETING: Message = {
  role: "assistant",
  content:
    "👋 Hi! I'm ScholarArth AI. I can help you find scholarships, prepare documents, write SOPs, and answer any scholarship-related questions. What would you like to know?",
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I couldn't process that. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please check your connection and try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
      }}
    >
      {/* Chat Window */}
      <div
        style={{
          height: isOpen ? 380 : 0,
          overflow: "hidden",
          transition: "height .3s ease",
          background: "#fff",
          borderTop: isOpen ? "1px solid var(--bdr)" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            background: "var(--ink)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>ScholarArth AI</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Scholarship intelligence · Always online</div>
          </div>
          <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                maxWidth: "82%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "var(--brand)" : "var(--bg)",
                color: msg.role === "user" ? "#fff" : "var(--ink)",
                padding: "9px 13px",
                borderRadius: 10,
                borderBottomRightRadius: msg.role === "user" ? 3 : 10,
                borderBottomLeftRadius: msg.role === "assistant" ? 3 : 10,
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {msg.content}
            </div>
          ))}

          {/* Quick replies after greeting */}
          {messages.length === 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 100,
                    fontSize: 11.5,
                    fontWeight: 600,
                    border: "1.5px solid var(--brand-soft)",
                    background: "var(--brand-bg)",
                    color: "var(--brand)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "var(--bg)",
                padding: "9px 13px",
                borderRadius: 10,
                borderBottomLeftRadius: 3,
                fontSize: 13,
                color: "var(--ink3)",
              }}
            >
              ⟳ Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Row */}
        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid var(--bdr)",
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask anything about scholarships..."
            aria-label="Chat message input"
            style={{
              flex: 1,
              border: "1.5px solid var(--bdr)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "var(--ink)",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--bdr)")}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            style={{
              width: 32,
              height: 32,
              background: "var(--brand)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: !input.trim() || loading ? 0.5 : 1,
            }}
          >
            <Send size={14} color="#fff" />
          </button>
        </div>
      </div>

      {/* Toggle Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "var(--ink)",
          color: "#fff",
          height: 44,
          padding: "0 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
          <Bot size={16} />
          ScholarArth AI — Ask anything about scholarships
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
    </div>
  );
}
