# The closing screen — every branch, written out

Do not let Capy generate this text. It will produce one warm generic paragraph and the
"no forced outcome" rule dies quietly in the implementation. Hand it these strings.

## How it composes

The closing screen is three short lines, picked independently, in this order:

    [ PREDICTION ]  what you guessed vs what happened
    [ CHOICE     ]  what you chose to send
    [ DETECTOR   ]  what Pangram said, and what it cannot say

Then the fixed final line, always, on its own:

    AI can make your words better. Only you can decide what better means.

Three slots, 6 x 5 x 5 combinations, no paragraph ever repeated. Nothing is generated at
runtime, so nothing can drift into slop under load.

## Tone rules
- Second person, plain, short. No exclamation marks. No congratulating, no scolding.
- Never tell them they chose wrong. The whole piece collapses if it moralizes.
- Never imply Pangram judged quality, meaning or sincerity. It reports authorship.
- "Lost" is never softened to "changed" when the sentence is actually gone.

---

## SLOT 1 — PREDICTION x OUTCOME

Outcome has three states: `verbatim` (exact words kept), `semantic` (meaning kept, words
changed), `gone`.

**predicted survive / verbatim**
> You thought it would survive. It did — every word.

**predicted survive / semantic**
> You thought it would survive. The meaning did. The words didn't, and one of them mattered.

**predicted survive / gone**
> You thought it would survive. It isn't in there anymore.

**predicted lost / verbatim**
> You expected to lose it. The edit left it alone. Not everything polish touches, it takes.

**predicted lost / semantic**
> You expected to lose it. What came back says the same thing with the specifics filed off.

**predicted lost / gone**
> You expected to lose it, and you were right. You knew exactly what was at risk, and it
> went anyway.

---

## SLOT 2 — WHAT THEY CHOSE

**chose original, never wavered**
> You kept your own words. Most people don't.

**chose original after first picking an edit**
> You almost sent the edited one. Then you saw what it cost, and went back.

**chose the light edit**
> You took the version that fixed your commas and otherwise left you alone. That is the
> cheapest trade in here.

**chose a polished version, never wavered**
> You read them all and chose the one that sounds better. Nobody made you. That's the part
> worth noticing.

**chose a polished version after first picking their original**
> You had your own letter in your hand, saw the price, and traded it anyway. That is a real
> answer to the question, and not an embarrassing one.

---

## SLOT 3 — WHAT PANGRAM SAID

Branch on the real API result for the letter they actually chose.

**reads human**
> Pangram reads this as human-written. It is telling you who typed it — not whether it was
> worth sending.

**reads AI, and they chose an edited version**
> Pangram reads this as machine-written, and it is right about that. It has no opinion on
> whether you should send it. That was never a question a detector could answer.

**reads AI, and they chose their own untouched letter**
> Pangram reads your own writing as machine-written. It is wrong. Detectors are wrong
> sometimes — which is exactly why nothing here let it decide anything that mattered.

**reads mixed / partly AI**
> Pangram reads this as partly machine-written, which is accurate: it is. The number can
> tell you that much, and nothing beyond it.

**the call failed**
> Pangram didn't answer. The score was never the point. What you chose is still what you
> chose.

---

## Implementation

```ts
type Outcome   = "verbatim" | "semantic" | "gone";
type Predicted = "survive" | "lost";
type Choice    = "original" | "original_after_switch" | "light"
               | "polished" | "polished_after_switch";
type Verdict   = "human" | "ai" | "ai_but_chose_original" | "mixed" | "error";

// Three lookups, concatenated. No LLM call. No template interpolation.
closing = [ PREDICTION[predicted][outcome], CHOICE[choice], DETECTOR[verdict] ];
```

`ai_but_chose_original` is not a separate API result — it is `ai` plus
`choice.startsWith("original")`. Resolve it before the lookup, because that combination is
the single most interesting outcome the piece can produce and it must not be smoothed into
the generic AI line.

### Deciding `outcome`
- `verbatim` — the protected sentence appears in the chosen text exactly, whitespace and
  punctuation normalized.
- `gone` — no sentence in the chosen text shares meaningful content with it.
- `semantic` — anything in between: same claim, different words. This is the common case and
  the most interesting one, so do not collapse it into `gone`.

In the `semantic` case, ghost **only the words that disappeared**, not the whole sentence.
On the real letter, level 2 loses exactly one word that matters: **you**. Ghosting the whole
line would hide the finding. The smallness is the point.
