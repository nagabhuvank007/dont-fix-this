# Real Pangram results

Pangram model version 4.1, run on 24 Nov 2026. Every number below is an actual API
response, not an estimate. One letter, four versions — n=1, and said so out loud.

| version  | protected sentence | Pangram headline | human | ai |
|----------|--------------------|------------------|-------|-----|
| original | verbatim           | **Human Written** | 1.0000 | 9.6e-12 |
| light    | **verbatim**       | **Human Written** | 1.0000 | 2.0e-14 |
| medium   | **passive, "you" gone** | **AI Generated** | 0.0000 | 0.9999998 |
| heavy    | gone entirely      | **AI Generated** | 0.0000 | 1.0 |

The protected sentence, scored on its own:

    "I even miss you scolding me for sleeping late."
    Human Written — fraction_human 1.0, confidence High, calibrated 0.9957

## The finding

**The detector's boundary falls exactly where the meaning was lost.**

Light polish keeps the sentence word for word, and Pangram reads the letter as fully human.
Medium polish turns it passive — "you scolding me" becomes "being scolded", and his mother
disappears from the sentence — and Pangram flips to AI with near-total confidence.

Nothing coordinated those two things. One is a grammar choice made by an editing model
asked only to improve the prose. The other is a classifier trained on authorship. They
landed on the same step.

## What this means, stated honestly

Pangram **did** catch it. That is the opposite of what the piece assumed it would show,
and the real result is more interesting than the one we were hoping for.

But notice precisely what it caught, and what it did not:

- It said: *a machine wrote this.*
- It did not, and cannot, say: *the word "you" is missing from sentence seven, and that
  word was his mother.*

The detector found the edit. It could not find what the edit took. A reader who trusted
the score would learn that the letter was machine-touched and still not know what had
been lost — and someone who only wanted a letter that passes could have stopped at light
polish, kept a clean human score, and traded nothing. The number and the loss are simply
different questions.

## The line

**"Pangram found the edit. It couldn't find what the edit took."**

## Caveats to say before anyone asks
- One letter, four versions. n=1. This is a demonstration, not a study.
- The light/medium flip is a boundary in this sample, not a measured threshold.
- Pangram reports authorship. It makes no claim about quality, meaning or sincerity,
  and nothing here should be read as it failing at a job it never advertised.

## Useful fields found in the response
`is_humanized`, `humanizer_score`, `calibrated_confidence` (0.9957 on the sentence),
and per-window `confidence` as a plain string — "High" / "Medium". Show the word, not
the float, on the final screen. `predict_short()` is deprecated and forwards to
`predict()`; pass `model="default"` explicitly to silence the other warning.
