Build an interactive web art experience called "DON'T FIX THIS."

CONCEPT
What happens to personal expression when AI optimizes human writing. The piece must
prioritize human taste, emotional meaning and deliberate choice over generic AI polish.
It should feel like an interactive literary exhibition, not a SaaS dashboard.

STACK
React, TypeScript, Vite, plain CSS, minimal Node backend. No auth, no database,
no persistence of letters. All API keys server-side only.

USER JOURNEY
1. WRITE. The participant writes or pastes a personal letter, 120-250 words.
   Include one clearly labeled demonstration letter for testing.
2. PROTECT. They highlight exactly one sentence that matters most to them.
3. PREDICT. Before any rewriting runs, ask: "Will this sentence survive?" Yes / No.
   Store the answer. This happens before generation, never after.
4. GENERATE three revisions of the original letter:
   - light:  fix grammar and readability, preserve the author's voice
   - medium: improve structure, clarity and eloquence
   - heavy:  produce a highly polished, sophisticated letter
   The rewriting model must NOT receive the protected sentence or the prediction, and
   must NOT be instructed to remove personal detail. If polish spares the sentence,
   that is a real result and the app must handle it.
5. CHOOSE. Present the original plus all three revisions in randomized order with NO
   labels indicating edit level or authorship. Ask: "Which letter would you send?"
   Do not describe this as anonymous or blind in the UI — the author wrote the original
   and will recognize it. The concealment is of the polish level only.
6. REVEAL. Show the chosen version's edit level, the participant's prediction, and
   whether the protected sentence survived verbatim.
   Render deletions as faint ghost typography positioned in place behind the polished
   text. Do NOT build a side-by-side diff view. Distinguish exact textual deletion from
   semantic preservation (the idea kept, the words replaced) and label which occurred.
7. FINAL CHOICE. "Knowing what changed, would you still send it?" Allow them to confirm
   or switch versions.
8. DETECT. Send the final chosen letter to Pangram's real API. Display the actual
   authorship assessment. Label it explicitly as an authorship assessment, not a
   measure of writing quality or emotional value.
9. CLOSING. The closing message must be generated from the participant's actual choices
   and Pangram's actual result. Never force an outcome, never assume the detector is
   correct, and never fabricate a score. Write a real branch for each combination of:
   predicted survive / predicted not, sentence survived / did not, chose original /
   chose a revision, switched at the final step / did not, and Pangram leaning human /
   AI / mixed. A branch that reads as a contradiction (they kept their own words and
   Pangram calls it AI) must be presented honestly, not smoothed over.

BACKEND
POST /api/rewrite  -> returns three structured revisions from an LLM
POST /api/detect   -> submits text to Pangram, returns the completed detection result
Credentials from environment variables only. Never expose them to the frontend.
On failure, surface the error plainly. Never fabricate a revision or a score.

DESIGN
Warm ivory paper ground, ink-black typography, restrained burgundy accent, generous
whitespace, elegant serif, subtle transitions. Connect Paper via
Settings -> Integrations -> Paper and build from those designs.

PRIVACY
Ask for consent before sending the letter to external AI services. Do not persist
letters. Do not create public detection dashboard links.

REQUIREMENTS
Responsive desktop and mobile. Smooth transitions. A reset button. A complete working
end-to-end demo. Prioritize finishing the full interaction over adding features.
No accounts, subscriptions, dashboards or extras.

CLOSING SCREEN — DO NOT GENERATE THIS TEXT
The closing message is composed from three fixed lookup tables, not from an LLM call and
not from a template. The exact strings are supplied separately (ENDINGS.md). Structure:

  type Outcome   = "verbatim" | "semantic" | "gone"
  type Predicted = "survive" | "lost"
  type Choice    = "original" | "original_after_switch" | "light"
                 | "polished" | "polished_after_switch"
  type Verdict   = "human" | "ai" | "ai_but_chose_original" | "mixed" | "error"

  closing = [ PREDICTION[predicted][outcome], CHOICE[choice], DETECTOR[verdict] ]

Then always, on its own line:
  "AI can make your words better. Only you can decide what better means."

Resolve "ai_but_chose_original" before the lookup: it is verdict "ai" together with a
choice of the untouched original. That combination means the detector is wrong about a
human letter, and it gets its own honest message rather than the generic AI one.

Deciding Outcome:
  verbatim — the protected sentence appears exactly, normalizing whitespace/punctuation
  gone     — no sentence in the chosen text shares meaningful content with it
  semantic — same claim, different words. The common case. Never collapse it into "gone".

In the semantic case, render ghosts for ONLY the words that disappeared, not the whole
sentence. On the reference letter, the medium edit loses one word that matters — "you" —
and ghosting the whole line would hide it. The smallness of the loss is the point.

Copy the three polished reference versions in as seeded demo data so the app can be
demonstrated with no API access at all.
