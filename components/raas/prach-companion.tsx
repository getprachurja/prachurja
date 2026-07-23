"use client";

import { FormEvent, useState } from "react";
import { Leaf, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const welcome: ChatMessage = {
  role: "assistant",
  content:
    "Hello, I’m Prach. I can explain Prachurja’s restoration approach, help you think about Miyawaki suitability, or guide you to the right next step.",
};

const quickPrompts = [
  "Is Miyawaki right for my site?",
  "How does a restoration project begin?",
  "What information should I collect?",
];

export function PrachCompanion() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage].slice(-8);
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) {
        throw new Error(payload.error ?? "Prach could not answer just now.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.answer as string },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Prach could not answer just now.",
      );
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <div className="prach">
      {open && (
        <section id="prach-panel" className="prach-panel" role="dialog" aria-modal="false" aria-labelledby="prach-title">
          <header>
            <div>
              <span><Leaf aria-hidden="true" /></span>
              <div>
                <b id="prach-title">Prach</b>
                <small>Prachurja restoration guide</small>
              </div>
            </div>
            <button type="button" aria-label="Close Prach" onClick={() => setOpen(false)}>
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="prach-messages" aria-live="polite">
            {messages.map((message, index) => (
              <p className={message.role} key={`${message.role}-${index}`}>
                {message.content}
              </p>
            ))}
            {busy && <p className="assistant prach-thinking">Prach is thinking…</p>}
          </div>

          {messages.length === 1 && (
            <div className="prach-prompts">
              {quickPrompts.map((prompt) => (
                <button type="button" onClick={() => void ask(prompt)} key={prompt}>
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {error && <p className="prach-error" role="alert">{error}</p>}
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="prach-question">Ask Prach a question</label>
            <input
              id="prach-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder="Ask about restoration…"
            />
            <button type="submit" aria-label="Send question" disabled={busy || !input.trim()}>
              <Send aria-hidden="true" />
            </button>
          </form>
          <small className="prach-note">
            Guidance is general. Site decisions require a field assessment.
          </small>
        </section>
      )}
      <button
        type="button"
        className="prach-trigger"
        aria-expanded={open}
        aria-controls="prach-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle aria-hidden="true" />
        <span>Ask Prach</span>
      </button>
    </div>
  );
}
