"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Leaf, MessageCircle, Send, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const shortcuts = [
  ["Plan a restoration", "How do I start a restoration project?"],
  ["Choose native plants", "How should I choose native plants?"],
  ["Partner with Prachurja", "How can I become a partner?"],
] as const;

function linkedContent(content: string) {
  const path = content.match(/\/(assessment|nursery|partner|projects|portal)\b/)?.[0];
  const label: Record<string, string> = { "/assessment": "Open assessment", "/nursery": "Browse native plants", "/partner": "See partner pathways", "/projects": "Explore projects", "/contact": "Contact support" };
  return <>{content.replace(path ?? "", "").trim()}{path && <a className="companion-link" href={path}>{label[path]} <ArrowRight size={14}/></a>}</>;
}

export default function AiCompanion() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Namaste — I’m Prach, your Prachurja companion. I can help you find the right restoration service, native-plant information, partner pathway or portal." }]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("prach:open", show);
    return () => window.removeEventListener("prach:open", show);
  }, []);

  async function send(prefilled?: string) {
    const content = (prefilled ?? input).trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10) }) });
      const payload = await response.json() as { answer?: string };
      setMessages((current) => [...current, { role: "assistant", content: response.ok && payload.answer ? payload.answer : "I couldn’t reach the guide just now. You can still use the main navigation or submit a site assessment." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "I’m temporarily offline. For site-specific help, please use the assessment form: /assessment" }]);
    } finally {
      setBusy(false);
    }
  }

  return <div className={`companion ${open ? "open" : ""}`}>
    {open && <section className="companion-panel" role="dialog" aria-modal="false" aria-label="Prach companion">
      <header><div className="companion-avatar"><Leaf/></div><div><b>Prach</b><span><i/> Prachurja companion</span></div><button onClick={()=>setOpen(false)} aria-label="Close Prach"><X/></button></header>
      <div className="companion-messages" aria-live="polite">{messages.map((message,index)=><div className={`companion-message ${message.role}`} key={`${message.role}-${index}`}>{message.role === "assistant" && <Sparkles size={14}/>}<p>{linkedContent(message.content)}</p></div>)}{busy && <div className="companion-message assistant thinking"><Sparkles size={14}/><p><span/><span/><span/></p></div>}<div ref={endRef}/></div>
      {messages.length < 3 && <div className="companion-shortcuts">{shortcuts.map(([label,prompt])=><button key={label} onClick={()=>send(prompt)}>{label}</button>)}</div>}
      <form onSubmit={(event)=>{event.preventDefault();send()}}><label className="sr-only" htmlFor="companion-input">Ask Prach</label><textarea id="companion-input" rows={1} maxLength={800} value={input} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>{if(event.key === "Enter" && !event.shiftKey){event.preventDefault();send()}}} placeholder="Ask Prach about restoration…"/><button disabled={!input.trim() || busy} aria-label="Send message"><Send/></button></form>
      <small>Guidance is general. Site-specific ecological decisions require assessment.</small>
    </section>}
    <button className="companion-trigger" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open ? "Close Prach" : "Open Prach"}>{open ? <X/> : <><MessageCircle/><span>Ask Prach</span></>}</button>
  </div>;
}
