"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";

interface Msg { role: "user" | "assistant"; content: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const hist = [...messages, userMsg];
    setMessages(hist);
    setInput("");
    setLoading(true);
    const res = await apiPost<{ content: string }>("/api/chat", { message: userMsg.content, history: messages.slice(-8) });
    setLoading(false);
    if (res.ok && res.data) setMessages([...hist, { role: "assistant", content: res.data.content }]);
    else setMessages([...hist, { role: "assistant", content: "Sorry, I couldn't respond. Try again." }]);
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-4 py-4" style={{ minHeight: "70vh" }}>
      <h1 className="text-xl font-black">AI Study Assistant</h1>
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-ink-400 mt-10">
            <p className="text-lg">Ask me anything about Japanese!</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["What does 学校 mean?", "How do I use 食べる?", "Explain N5 grammar"].map((s) => (
                <button key={s} onClick={() => { setInput(s); }} className="chip hover:bg-ink-800">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl px-4 py-3 text-sm max-w-[80%] ${m.role === "user" ? "ml-auto bg-sakura-500/20 text-ink-50" : "mr-auto bg-ink-800 text-ink-100"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="mr-auto rounded-xl bg-ink-800 px-4 py-3 text-sm text-ink-400">Thinking...</div>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
        <input className="flex-1 rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          placeholder="Ask about a word, grammar, or kanji..." value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn-primary !py-3" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
