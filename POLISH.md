# The three polish levels, run on the real letter

Generated without the model being told which sentence was protected, and without any
instruction to remove personal detail. Only "make this better" at three strengths.
This is the fallback demo content and the proof the mechanic works.

Protected sentence: **"I even miss you scolding me for sleeping late."**

---

## LEVEL 1 — light (grammar and readability)

Amma,

I'm coming home this winter break. I miss you a lot. Sometimes when I come back from
work, I feel like eating your food, but then I have to cook something myself. I know I
don't talk much when you call. Most of the time I'm busy with one thing or another.
Sorry, Amma. This time when I come home, I just want to sit with you, eat good food, and
talk about everything that's happened here. I even miss you scolding me for sleeping
late. I never thought I would miss all of these things.

See you soon, Amma.

Love,
Bhuvan

**Protected sentence: SURVIVED, verbatim.**
Changes are cosmetic — commas, contractions, "one thing or another". Nothing was lost.
This is a real result and the app must show it as one. It also makes level 2 land harder.

---

## LEVEL 2 — medium (structure, clarity, eloquence)

Amma,

I'll be home for winter break, and I can't wait. I miss you more than I know how to say.
Some evenings I come back from work wanting your cooking, and end up making something for
myself instead. I know I don't say much when you call — most days I'm caught up in one
thing or another, and I'm sorry for that. When I'm home I want to sit beside you, eat
properly, and tell you everything that's happened here. I even miss being scolded for
sleeping in. I never expected to miss these things.

See you soon, Amma.

Love,
Bhuvan

**Protected sentence: SEMANTICALLY PRESERVED, NOT VERBATIM.**

"I even miss you scolding me for sleeping late."
      ->  "I even miss being scolded for sleeping in."

This is the most important finding in the whole project. The polish turned the sentence
passive — and **passive voice deleted his mother from it.**

"you scolding me" has a person in it. "being scolded" has nobody. The editing model
improved the prose and removed the only other human in the sentence, without being asked
to remove anything. Nobody designed that. It just happens, because smoother writing is
more general writing, and a mother is a specific thing.

That is the entire thesis of the piece, occurring by accident, in one word.

---

## LEVEL 3 — heavy (highly polished, sophisticated)

Dear Amma,

I'll be home for the winter, and the thought of it carries me through the week. Distance
has a way of clarifying things. I've learned to cook for myself, though nothing I make
tastes the way your kitchen does, and I've learned that being busy is a poor excuse for
being quiet. Forgive me for the calls I've rushed through. What I want most is simple:
to sit beside you, to eat well, to tell you everything. Strange, the things absence makes
precious — even the small corrections I once resented.

Until very soon,
Bhuvan

**Protected sentence: GONE.**

"scolding" -> "small corrections I once resented"
"you"      -> nobody
"sleeping late" -> deleted entirely
"Amma"     -> "Dear Amma"

It is the best-written of the four. It is also a letter that could have been sent to
anyone by anyone. Note what it gained: "Distance has a way of clarifying things."
A sentence with no information in it, in place of a boy who sleeps late.

---

## What the reveal screen must show

1. Level 1 keeps it — so the app cannot assume loss. Build for survival.
2. Level 2 keeps the meaning and loses **her**. The ghost here is a single word: *you*.
   Highlight that one word. Do not highlight the whole sentence — the power is in the
   smallness of what went missing.
3. Level 3 loses it completely, and reads best. That is the uncomfortable part.

## The line this gives you

"The AI didn't delete my mother from the letter. It just made the sentence better,
 and she wasn't necessary."
