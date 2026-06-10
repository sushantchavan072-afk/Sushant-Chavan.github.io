import { FormEvent, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ClientPayload = {
  messages: ChatMessage[];
  selectedModel?: string | null;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hello! I'm Milo, your portfolio AI assistant. Ask me about the portfolio, my editorial work, or pharmacy experience.",
  },
];

async function sendChatMessage(messages: ChatMessage[], selectedModel: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, selectedModel }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const errorMessage = payload?.error || response.statusText || "Server error";
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data?.text) {
    throw new Error("No response text received from server.");
  }

  return data.text as string;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center text-mint">
          <Bot className="w-4 h-4" />
        </div>
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-4 py-3 text-foreground/80 flex items-center gap-1.5 h-10">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-mint"
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-mint"
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-mint"
        />
      </div>
    </div>
  );
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="flex-shrink-0 mt-1">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-primary text-primary-foreground" : "bg-mint/20 text-mint"}`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
      </div>
      <div
        className={`rounded-2xl px-5 py-3.5 max-w-[80%] whitespace-pre-wrap break-words leading-relaxed text-sm ${
          isUser
            ? "bg-mint text-primary-foreground rounded-tr-sm shadow-glow-mint/30"
            : "bg-white/5 border border-white/10 text-foreground/90 rounded-tl-sm"
        }`}
      >
        <div
          className={`mono text-[9px] uppercase tracking-[0.2em] mb-1.5 ${isUser ? "text-primary-foreground/70" : "text-foreground/40"}`}
        >
          {isUser ? "You" : "Milo"}
        </div>
        <div>{message.text}</div>
      </div>
    </motion.div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("llama-3.3-70b-versatile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setPrompt("");
    setError(null);
    setLoading(true);

    try {
      const reply = await sendChatMessage(nextMessages, selectedModel);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reach the AI service.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "My connection seems to be interrupted. Please check the network or API configuration.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chatbot" className="relative py-16 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="max-w-xl">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
              05 — Talk to Milo
            </div>
            <h2 className="display text-5xl md:text-7xl mb-6">
              Talk to <span className="italic text-aurora">Milo</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-foreground/70 leading-relaxed">
                Meet Milo, an integrated AI assistant trained specifically on this portfolio. Milo
                can provide detailed insights into my pharmaceutical education, data analytics
                skills, clinical practice, and editorial workflow.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-mint/20 text-foreground text-sm font-medium shadow-glow-mint/10">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span className="bg-gradient-to-r from-mint via-aqua to-violet bg-clip-text text-transparent font-bold">
                  Special Instruction:
                </span>{" "}
                Please touch or click the image to access the chat.
              </div>
            </div>
          </div>

          {/* Right Side: Flipping Card Container */}
          <div className="relative w-full h-[500px] md:h-[600px] [perspective:2000px]">
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isChatOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              {/* FRONT FACE: Image Card */}
              <div
                className="absolute inset-0 w-full h-full glass rounded-[2.5rem] overflow-hidden cursor-pointer group shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                onClick={() => setIsChatOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-transparent to-aqua/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  src="/Gemini_Generated_Image_2166rk2166rk2166.png"
                  alt="Milo AI"
                  className="absolute inset-0 w-full h-full object-cover object-top mix-blend-multiply opacity-90 transition-transform duration-700 scale-[1.35] origin-top group-hover:scale-[1.4] pointer-events-none"
                />
              </div>

              {/* BACK FACE: Chatbot Interface */}
              <div
                className="absolute inset-0 w-full h-full glass rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 bg-background/50"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Chat Header */}
                <div className="p-5 px-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div>
                      <h3 className="font-display text-xl text-foreground m-0 leading-tight">
                        Milo AI
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                        <span className="text-[10px] uppercase tracking-wider text-foreground/50 mono">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-foreground/60 hover:text-foreground relative z-10"
                    aria-label="Close Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div
                  className="flex-1 relative min-h-0"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
                  }}
                >
                  <div
                    className="absolute inset-0 overflow-y-auto space-y-6 p-6 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    ref={messagesRef}
                  >
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <ChatMessageBubble key={i} message={msg} />
                      ))}
                    </AnimatePresence>

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-2xl p-4 rounded-tl-none bg-white/5 border border-white/10">
                          <TypingIndicator />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-5 border-t border-white/10 bg-white/5 backdrop-blur-md">
                  <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask Milo something..."
                      className="flex-1 bg-black/20 border border-white/10 rounded-full py-3.5 px-6 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-mint/50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || loading}
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-mint text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 shadow-glow-mint/20"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Scroll Progress Ring */}
      <motion.div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full glass shadow-[0_0_40px_-5px_rgba(167,240,217,0.4)] pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-black/5"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-mint"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
        <div className="w-2.5 h-2.5 rounded-full bg-mint" />
      </motion.div>
    </section>
  );
}
