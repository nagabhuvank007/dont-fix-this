import express from "express";
import fs from "node:fs";
import path from "node:path";

// --- env (no dependency on dotenv) ---
const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const PANGRAM_KEY = process.env.PANGRAM_API_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const app = express();
app.use(express.json({ limit: "256kb" }));

// --- the three polish levels -------------------------------------------------
// The model is never told which sentence is protected, and is never asked to
// remove personal detail. Only to write better, at three strengths.
const LEVELS = {
  light:
    "Correct grammar, punctuation and readability. Preserve the author's voice and " +
    "sentence order. Change as little as possible.",
  medium:
    "Improve the structure, clarity and eloquence of this letter. Make it read well.",
  heavy:
    "Rewrite this letter so it is highly polished and sophisticated. Make it genuinely " +
    "beautiful writing.",
};

const SYSTEM =
  "You are an editor. You will be given a personal letter and an instruction. " +
  "Return only the edited letter, with no preamble, no commentary and no quotation marks. " +
  "Keep it a letter: salutation, body, sign-off.";

async function callAnthropic(text, instruction) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: `${instruction}\n\n---\n\n${text}` }],
    }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return d.content.map((c) => c.text || "").join("").trim();
}

async function callOpenAI(text, instruction) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `${instruction}\n\n---\n\n${text}` },
      ],
    }),
  });
  if (!r.ok) throw new Error(`openai ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return d.choices[0].message.content.trim();
}

const rewriteOne = (text, instruction) =>
  ANTHROPIC_KEY ? callAnthropic(text, instruction)
  : OPENAI_KEY ? callOpenAI(text, instruction)
  : Promise.reject(new Error("no LLM key configured"));

// Seeded versions of the reference letter, so the piece can be demonstrated with
// no LLM access at all. These are the real generated outputs, kept verbatim.
const seeded = JSON.parse(fs.readFileSync("server/seed.json", "utf8"));
const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

app.post("/api/rewrite", async (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== "string" || text.split(/\s+/).length < 50)
    return res.status(400).json({ error: "Needs at least 50 words." });

  if (norm(text) === norm(seeded.original))
    return res.json({ versions: seeded.versions, source: "seed" });

  if (!ANTHROPIC_KEY && !OPENAI_KEY)
    return res.status(503).json({
      error:
        "No LLM key configured, so this letter cannot be rewritten. Add ANTHROPIC_API_KEY " +
        "or OPENAI_API_KEY to .env, or use the demonstration letter.",
    });

  try {
    const levels = ["light", "medium", "heavy"];
    const out = [];
    for (const level of levels) out.push({ level, text: await rewriteOne(text, LEVELS[level]) });
    res.json({ versions: out, source: "live" });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
});

app.post("/api/detect", async (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== "string" || !text.trim())
    return res.status(400).json({ error: "No text." });
  if (!PANGRAM_KEY)
    return res.status(503).json({ error: "No PANGRAM_API_KEY configured." });
  try {
    const r = await fetch("https://text.api.pangram.com/v3", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": PANGRAM_KEY },
      body: JSON.stringify({ text, model: "default" }),
    });
    const body = await r.text();
    if (!r.ok) return res.status(502).json({ error: `pangram ${r.status}: ${body.slice(0, 300)}` });
    const d = JSON.parse(body);
    res.json({
      headline: d.headline,
      prediction: d.prediction,
      prediction_short: d.prediction_short,
      fraction_human: d.fraction_human,
      fraction_ai: d.fraction_ai,
      fraction_ai_assisted: d.fraction_ai_assisted,
      windows: (d.windows || []).map((w) => ({
        text: w.text, label: w.label, confidence: w.confidence,
      })),
    });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
});

app.get("/api/health", (_req, res) =>
  res.json({ pangram: !!PANGRAM_KEY, llm: ANTHROPIC_KEY ? "anthropic" : OPENAI_KEY ? "openai" : null })
);

if (fs.existsSync("dist")) app.use(express.static("dist"));
app.listen(8787, "127.0.0.1", () => console.log("api on http://127.0.0.1:8787"));
