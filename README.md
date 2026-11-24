# DON'T FIX THIS.

**What are you willing to lose to sound better?**

Built in five hours at the SF Non-Slop Hackathon — Pangram × Kino × Capy × Paper.
Vivarium, San Francisco, 24 November 2026.

---

## The piece

AI can make your writing better. It cannot know which part was worth keeping.

So this asks you to decide first, and then watch what better costs.

1. **Write** something personal. A real letter, to a real person.
2. **Protect** the one sentence you would hate to lose.
3. **Predict** — will it survive AI editing? You answer before anything runs.
4. **Choose** from four unlabeled versions: your original and three escalating polishes.
   *Which one would you send?*
5. **Reveal** — what you predicted, what actually happened, and the words that were
   removed, hanging as ghosts behind the polished text.
6. **Decide again**, knowing what it cost. Then Pangram reads the letter you chose
   and says who it thinks wrote it.

The polished versions sound better. People pick them. And then they see that the
sentence they swore they'd never lose is exactly what they traded away.

## The letter

`letter.txt` is real. I wrote it to my mother, by hand, before any of this ran.
No AI drafted it or touched it — that was the one rule, because the whole piece
collapses if the centrepiece is generated.

The protected sentence was chosen before a single rewrite existed:

> *"I even miss you scolding me for sleeping late."*

It's the only line that's both specific and counterintuitive — missing a *bad* thing.
Polish handles that badly. It cuts it for being negative, or smooths it into something
agreeable with the love drained out.

## What Pangram does, and what it doesn't

Pangram reports **authorship**. It does not measure writing quality, meaning or sincerity.

That distinction is the point of the last screen. The detector can tell you who typed
a letter. It cannot tell you which letter was worth sending. That judgment is still
only yours — which is the honest answer to *what matters when you can generate anything.*

The score shown is always the real API result. No outcome is forced, no ending assumes
the detector is right, and when it contradicts itself — a human letter read as machine —
the piece says so rather than smoothing it over.

## Built with

| Tool | Job |
|---|---|
| **Pangram** | The authorship reveal on the final screen |
| **Paper** | Visual identity and the ghost typography |
| **Capy** | The application and both API endpoints |
| **Kino** | The presentation film |

## Running it

Needs a Pangram API key and an LLM key, both server-side only.

```bash
cp .env.example .env   # add your keys
npm install
npm run dev
```

Pangram requires 50+ words per request. The key is never exposed to the frontend.

---

**AI can make your words better. Only you can decide what better means.**

Naga Bhuvan — [@nagabhuvank007](https://github.com/nagabhuvank007)
