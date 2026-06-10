type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type RequestBody = {
  messages: ChatMessage[];
  selectedModel?: string | null;
};

function parseBody(req: { body?: unknown }) {
  if (req.body && typeof req.body !== "string") {
    return req.body as RequestBody;
  }

  return req.body ? JSON.parse(String(req.body)) : {};
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: unknown) => void };
  },
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, selectedModel } = parseBody(req) as RequestBody;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Message history is required." });
  }

  const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  const googleKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.VITE_GOOGLE_GEMINI_API_KEY;

  const provider = openAiKey ? "openai" : groqKey ? "groq" : googleKey ? "google" : null;

  if (!provider) {
    return res.status(500).json({
      error:
        "Milo is not configured on the server. Set OPENAI_API_KEY, GROQ_API_KEY, or GOOGLE_GEMINI_API_KEY in Vercel environment variables.",
    });
  }

  const isGoogle = provider === "google";
  const isGroq = provider === "groq";
  const openAiModel = process.env.OPENAI_MODEL || process.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
  const googleModel = process.env.GOOGLE_MODEL || process.env.VITE_GOOGLE_MODEL || "chat-bison-001";
  const groqModel =
    process.env.GROQ_MODEL || process.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

  const model = selectedModel || (isGroq ? groqModel : isGoogle ? googleModel : openAiModel);
  const url = isGoogle
    ? `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateMessage?key=${googleKey}`
    : isGroq
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `You are Milo, a helpful AI assistant for Sushant Chavan's personal portfolio website.
Answer clearly and politely. Provide concise, professional responses. Use simple formatting.
You can share contact information when asked: Email is sushantchavan072@gmail.com, Phone is +91 95299 36483, Location is Dahanu, Palghar, MH.
Here is the complete website content you can use to answer questions:
- Sushant Chavan is a B.Pharmacy student at Sinhgad College of Pharmacy (2023-27). He blends pharmaceutical practice, data analytics, and editorial design. He has hands-on expertise in professional documentation, data management, and organizational communication.
- Skills:
  - Data & Analytics: Data Analysis, SAS Programming, Tableau, Log Analysis, Excel.
  - Gen AI & IT: Python, LLMs, Claude, Gemini, Computer Networking.
  - Pharmaceutical: SOP Writing, QA / QC, GMP Awareness, Regulatory Docs, Reporting.
  - Communication: Public Relations, English, Hindi, Marathi, Gujarati, Canva Design, Editorial.
- Experience:
  - District Editor at Rotary International District 3131 (2025-26): Distributes newsletters to 2.7K+ members, maintains compliant documentation.
  - PR Officer & Editor at Rotaract Club of SCOP (Current): Owns multi-platform comms strategy, press releases, social content.
  - Editor at Rotaract Club of SCOP (2024-25): Curated monthly newsletters and event reports, designed flyers.
- Certifications (Mar 2026): Deloitte Data Analytics, Walmart Pharmacy Technician, AI In Pharma.
- Work: Showcases Yearbook cover and spreads.
You are allowed to answer specific questions using this context.`;

  const body = isGoogle
    ? JSON.stringify({
        temperature: 0.7,
        candidateCount: 1,
        prompt: {
          messages: [
            {
              author: "system",
              content: systemPrompt,
            },
            ...messages.map((message) => ({
              author: message.role === "user" ? "user" : "assistant",
              content: message.text,
            })),
          ],
        },
      })
    : JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        ],
      });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isGoogle ? {} : { Authorization: `Bearer ${isGroq ? groqKey : openAiKey}` }),
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || response.statusText });
    }

    const json = await response.json();
    const text = isGoogle
      ? json?.candidates?.[0]?.content?.text ||
        json?.candidates?.[0]?.content ||
        json?.candidates?.[0]?.text
      : json?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({ error: "Unable to parse response from AI provider." });
    }

    return res.status(200).json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return res.status(500).json({ error: message });
  }
}
