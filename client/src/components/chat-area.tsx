// client/src/components/ui/chat-area.tsx
import React, { useEffect, useRef, useState } from "react";

// ---------- Types ----------
type Line = { from: "you" | "buddy"; text: string };

// Backend endpoint (your Express route)
const API = "/api/chat";

// Heuristics to add a "?" when you (the student) forget it
const QUESTION_STARTS = [
  "qui",
  "que",
  "quoi",
  "quand",
  "pourquoi",
  "comment",
  "où",
  "ou",
  "est-ce",
  "Qu'est-ce",
  "peux-tu",
  "peut-tu",
  "peux vous",
  "pouvons-nous",
  "est ce",
  "qu'est-ce",
  "as-tu",
  "as tu",
  "as-tu",
  "as-tu",
];

function looksLikeQuestion(s: string) {
  const t = s.trim().toLowerCase();
  if (!t) return false;
  if (/[?!]$/.test(t)) return false;
  return QUESTION_STARTS.some((w) => t.startsWith(w + " "));
}

// Pick a decent French TTS voice
function pickFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  // Prefer fr-FR exact, then anything that contains 'French' or 'FR'
  return (
    voices.find((v) => v.lang?.toLowerCase() === "fr-fr") ||
    voices.find((v) => /french/i.test(v.name)) ||
    voices.find((v) => /fr/i.test(v.lang)) ||
    null
  );
}

function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Some browsers need this to refresh the voice list
    const ensureVoices = new Promise<void>((resolve) => {
      const have = synth.getVoices();
      if (have.length) return resolve();
      synth.onvoiceschanged = () => resolve();
      // trigger
      synth.getVoices();
      // safety resolve if event never fires
      setTimeout(() => resolve(), 300);
    });

    ensureVoices.then(() => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR";
      const v = pickFrenchVoice();
      if (v) u.voice = v;
      u.rate = 1;
      u.pitch = 1.1;
      synth.speak(u);
    });
  } catch {
    // ignore TTS errors silently
  }
}

export default function ChatArea() {
  const [lines, setLines] = useState<Line[]>([
    { from: "buddy", text: "Salut ! De quoi veux-tu parler aujourd’hui ?" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // auto-scroll target
  const endRef = useRef<HTMLDivElement | null>(null);

  // ---- Auto-scroll whenever lines change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [lines]);

  // ---- Web Speech API (speech-to-text) for your input
  const recRef = useRef<any>(null);
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "fr-FR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const txt = e.results?.[0]?.[0]?.transcript ?? "";
      if (txt) {
        setMessage(txt);
        // send immediately from voice
        void onSend(true);
      }
    };
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  // ---- Helpers to push chat lines
  const push = (from: Line["from"], text: string) =>
    setLines((prev) => [...prev, { from, text }]);

  // ---- Send message to backend
  async function onSend(fromVoice = false) {
    const raw = message.trim();
    if (!raw) return;

    // Ensure student's question shows a "?"
    const final = looksLikeQuestion(raw) ? raw + " ?" : raw;

    push("you", final);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: final }),
      });

      const data = await res.json().catch(() => ({}) as any);
      const reply: string =
        (data && (data.reply || data.text)) ||
        "Oups, j’ai eu un problème. Réessaie.";

      push("buddy", reply);
      // Buddy always speaks his reply
      speak(reply);
    } catch {
      push("buddy", "Oups, j’ai eu un problème. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  // ---- Start / stop listening
  function startListening() {
    const rec = recRef.current;
    if (!rec)
      return push(
        "buddy",
        "Désolé, la reconnaissance vocale n’est pas prise en charge sur ce navigateur.",
      );
    if (listening) return;

    try {
      setListening(true);
      rec.start();
    } catch {
      setListening(false);
    }
  }

  function stopListening() {
    const rec = recRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {
      /* ignore */
    }
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Bubbles */}
      <div
        style={{
          height: "58vh",
          overflowY: "auto",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "#fbfcfe",
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              alignSelf: l.from === "you" ? "flex-end" : "flex-start",
              maxWidth: "78%",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                lineHeight: 1.35,
                background: l.from === "you" ? "#aee1f9" : "#e9f6b7",
                border:
                  l.from === "you" ? "1px solid #84c8e3" : "1px solid #d6eaa0",
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}
            >
              {l.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSend();
            }
          }}
          placeholder="Parle ou écris ici…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #dcdcdc",
            outline: "none",
          }}
        />
        <button
          onClick={() => void onSend()}
          disabled={loading || !message.trim()}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: loading ? "#9aa3af" : "#3b82f6",
            color: "#fff",
            cursor: loading ? "default" : "pointer",
          }}
        >
          Envoyer
        </button>
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: listening ? "#ef4444" : "#22c55e",
            color: "#fff",
            cursor: "pointer",
            minWidth: 84,
          }}
        >
          {listening ? "Stop" : "Parler"}
        </button>
      </div>
    </div>
  );
}
