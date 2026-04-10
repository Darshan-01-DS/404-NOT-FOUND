"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, Bot, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Find scholarships for OBC BTech students in Maharashtra",
  "What documents do I need for NSP?",
  "When is MahaDBT deadline 2026?",
  "How to compress PDF for NSP portal?",
  "Explain non-creamy layer certificate",
];

const GREETING: Message = {
  role: "assistant",
  content:
    "👋 Hi! I'm ScholarArth AI — India's most knowledgeable scholarship assistant. I can help you find the right scholarships, prepare documents, understand eligibility, and write SOPs. What would you like to know?",
};

// Strip markdown bold/italic/headers that look ugly as plain text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")  // ***bold italic***
    .replace(/\*\*(.*?)\*\*/g, "$1")      // **bold**
    .replace(/\*(.*?)\*/g, "$1")          // *italic*
    .replace(/^#{1,6}\s+/gm, "")          // ## headings
    .replace(/^[-*] /gm, "• ")            // bullet points
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // inline code
    .trim();
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, loading]);

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
        // High-accuracy forced via backend
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      
      setMessages((prev) => [ ...prev, { role: "assistant", content: cleanMarkdown(data.reply) }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting to my high-accuracy model cluster right now. Please try again." },
      ]);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const chatHeight = isOpen ? `min(440px, 60vh)` : "0px";

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="btn btn-primary animate-fade-in-up"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: "50%",
            width: 56,
            height: 56,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(116, 51, 255, 0.35)",
            border: "2px solid #fff"
          }}
          aria-label="Open AI Assistant"
        >
          <Bot size={28} color="#fff" />
          <span style={{ position: "absolute", top: 2, right: 2, width: 12, height: 12, background: "var(--success)", border: "2px solid #fff", borderRadius: "50%" }} />
        </button>
      )}

      {/* Chat Window */}
      <div
        role="dialog"
        aria-label="ScholarArth AI Chat"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          bottom: isOpen ? 24 : 0,
          right: 24,
          width: "min(360px, calc(100vw - 48px))",
          height: chatHeight,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transform: isOpen ? "translateY(0)" : "translateY(20px)",
          transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "var(--bg-base)",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
          border: "1px solid var(--border-medium)",
          zIndex: 10000,
          overflow: "hidden"
        }}
      >
        {/* Chat Header */}
        <div style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.2px" }}>ScholarArth AI</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
               <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} /> Online
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} aria-label="Close chat" style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}>
            <X size={16} />
          </button>
        </div>

        {/* Messages Space */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-surface)" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              maxWidth: "85%", 
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start", 
              background: msg.role === "user" ? "var(--brand)" : "var(--bg-sunken)", 
              color: msg.role === "user" ? "#fff" : "var(--text-primary)", 
              padding: "12px 16px", 
              borderRadius: "var(--radius-lg)", 
              borderBottomRightRadius: msg.role === "user" ? 4 : "var(--radius-lg)", 
              borderBottomLeftRadius: msg.role === "assistant" ? 4 : "var(--radius-lg)", 
              fontSize: 13.5, 
              lineHeight: 1.6, 
              boxShadow: msg.role === "assistant" ? "inset 0 0 0 1px var(--border-light)" : "none",
              animation: "fadeInUp 0.3s ease-out" 
            }}>
              {msg.content}
            </div>
          ))}

          {/* Typing Bubble Indicator */}
          {loading && (
             <div style={{ maxWidth: "85%", alignSelf: "flex-start", background: "var(--bg-sunken)", padding: "14px 18px", borderRadius: "var(--radius-lg)", borderBottomLeftRadius: 4, display: "flex", gap: 6, alignItems: "center", boxShadow: "inset 0 0 0 1px var(--border-light)", animation: "fadeInUp 0.3s ease-out" }}>
               <div className="typing-dot" style={{ width: 6, height: 6, background: "var(--text-muted)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
               <div className="typing-dot" style={{ width: 6, height: 6, background: "var(--text-muted)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
               <div className="typing-dot" style={{ width: 6, height: 6, background: "var(--text-muted)", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both" }} />
             </div>
          )}

          {/* Quick Replies */}
          {messages.length === 1 && !loading && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} onClick={() => sendMessage(qr)} style={{ padding: "6px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, border: "1px solid var(--brand-soft)", background: "var(--brand-light)", color: "var(--brand)", cursor: "pointer", transition: "all 0.2s", textAlign: "left", lineHeight: 1.4 }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-bg)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand-light)")}>
                  {qr}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px", background: "var(--bg-base)", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", background: "var(--bg-sunken)", borderRadius: "var(--radius-lg)", padding: "4px", border: "1px solid var(--border-medium)", transition: "border 0.2s" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 14px", fontSize: 14, color: "var(--text-primary)" }}
              disabled={loading}
              aria-label="Type your message"
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: input.trim() ? "var(--brand)" : "var(--border-medium)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", transition: "background 0.2s" }} aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
