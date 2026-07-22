"use client";

/**
 * On-site chat widget for the retrieval assistant.
 *
 * A self-contained floating bubble + panel that talks to /api/chat. The bot's
 * brain runs server-side from this site's own content (no LLM, no external API).
 * Styled with the site's brand tokens so it matches the logo palette.
 */
import { useEffect, useRef, useState } from "react";
import type { ChatResponse, Product } from "@/lib/chatbot/types";

interface Msg {
  role: "user" | "bot";
  text: string;
  products?: Product[];
  suggestions?: string[];
  cta?: { label: string; href: string };
}

export function ChatWidget({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch the greeting from the server the first time the panel opens.
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      void send("", { silent: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, greeted]);

  // Keep the transcript scrolled to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string, opts: { silent?: boolean } = {}) {
    const trimmed = text.trim();
    if (!opts.silent && !trimmed) return;
    if (!opts.silent) setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          page: { url: window.location.href, title: document.title },
          // Prior turns give the LLM path multi-turn context (ignored by the
          // deterministic fallback). `messages` here excludes the current turn.
          history: messages.slice(-8).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = (await res.json()) as ChatResponse;
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.text,
          products: data.products,
          suggestions: data.suggestions,
          cta: data.cta,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry — I had trouble connecting. Please try again, or call us." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Launcher bubble */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : `Chat with ${businessName}`}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-accent text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/40"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-9 8.4 9 9 0 01-4-.9L3 21l1-4a8.38 8.38 0 01-1-4 8.5 8.5 0 018.5-8.5A8.38 8.38 0 0121 11.5z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={`${businessName} chat`}
          className="fixed bottom-24 right-5 z-50 flex h-[min(32rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-brand-primary px-4 py-3 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-accent text-sm font-bold">
              {businessName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">{businessName}</p>
              <p className="text-xs text-white/70">Typically replies instantly</p>
            </div>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/40 px-3 py-4">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-primary px-3 py-2 text-sm text-white"
                      : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-ink shadow-sm ring-1 ring-black/5"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>

                {/* Service cards */}
                {m.products && m.products.length > 0 && (
                  <div className="mr-auto mt-2 max-w-[90%] space-y-2">
                    {m.products.map((p) => (
                      <a
                        key={p.id}
                        href={p.url}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg border border-black/10 bg-white p-3 text-left shadow-sm transition-colors hover:border-brand-accent"
                      >
                        <p className="text-sm font-semibold text-brand-primary">{p.name}</p>
                        {p.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-black/60">{p.description}</p>
                        )}
                      </a>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {m.cta && (
                  <a
                    href={m.cta.href}
                    onClick={() => setOpen(false)}
                    className="btn btn-primary mt-2 w-full text-sm"
                  >
                    {m.cta.label}
                  </a>
                )}

                {/* Suggestion chips (only under the latest bot message) */}
                {m.role === "bot" && i === messages.length - 1 && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mr-auto mt-2 flex max-w-[90%] flex-wrap gap-1.5">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="rounded-full border border-brand-accent/40 bg-white px-3 py-1 text-xs font-medium text-brand-accent transition-colors hover:bg-brand-accent hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="mr-auto flex gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-3 shadow-sm ring-1 ring-black/5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-black/30 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-black/30 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-black/30" />
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-black/10 bg-white p-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services…"
              aria-label="Type your message"
              className="flex-1 rounded-full border border-black/15 px-4 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-accent text-white transition-opacity disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>

          <p className="bg-white px-3 pb-2 text-center text-[10px] text-black/40">
            Answers come from our own site info.
          </p>
        </div>
      )}
    </>
  );
}
