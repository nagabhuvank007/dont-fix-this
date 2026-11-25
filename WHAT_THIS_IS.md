# What you built

Read this once before you pitch. It is in plain words on purpose.

## In one sentence

A website that asks you to name the sentence you'd hate to lose, then lets AI make your
writing better, so you can watch what better costs.

## What a person actually does

1. Picks a letter a real person wrote by hand.
2. Marks one sentence — the one they'd hate to lose.
3. Guesses: will it survive?  *(They answer before anything runs.)*
4. AI rewrites the letter three times, each more polished.
5. They see four versions, unlabelled, and choose the one they'd send.
6. They see what their choice cost.
7. Pangram says who it thinks wrote the letter they chose.

## Your letter, and what happened to it

You wrote to your mother. You protected:

> "I even miss you scolding me for sleeping late."

The medium polish turned it into:

> "I even miss being scolded for sleeping in."

Three words did not come back: **you**, **me**, **late**.

"You scolding me" has two people in it. "Being scolded" has nobody. The editor was only
asked to write better. It was never told to remove anyone. But smoother writing is more
general writing, and a mother is a specific thing.

## The finding

Pangram's reading of the four versions:

| version | your sentence | Pangram |
|---|---|---|
| your own words | kept word for word | Human Written |
| lightly edited | kept word for word | Human Written |
| **edited for clarity** | **meaning kept, words gone** | **AI Generated** |
| heavily polished | gone | AI Generated |

The detector turns from human to machine on the exact step where your mother leaves the
sentence. Nobody arranged that. One is a grammar choice, the other is a classifier.

**But notice what it caught and what it didn't.** It said *a machine wrote this.* It
never said *the word "you" is missing, and that word was your mother.* The detector
answered its own question perfectly. Its question was not yours.

## The three sentences to say out loud

1. "AI can make your words better. Only you can decide what better means."
2. "Pangram found the edit. It couldn't find what the edit took."
3. "The sentence had two people in it. The better sentence has none."

## If someone pushes back

**"Isn't this just showing AI flattens writing?"**
That part is known. What's new is making you commit to a sentence first, then watching
you trade it away yourself — and finding the detector's boundary on the same step.

**"What does the Pangram number prove?"**
Authorship. Nothing else. Not quality, not meaning, not sincerity. Say that before they do.

**"Isn't one letter too small?"**
Yes. It's a demonstration, not a study. The app says so on screen.

**"Could you keep a human score and lose nothing?"**
Yes — stop at light polish. That's the uncomfortable part. Anyone who only wants a letter
that passes can have one. The score was never measuring the thing that mattered.

**"Did AI write the letter?"**
No. You wrote it before any of this ran, and Pangram reads it 1.0 human with all five
segments clean. That was the one rule: the machine edits, it never writes.

## What each sponsor tool did

- **Pangram** — three jobs: the whole letter, the protected sentence alone, and all four
  versions scored live to show where its boundary falls.
- **Capy** — built the per-sentence scoring feature and opened the pull request.
- **Paper** — the design system, the screens, the poster and the film's end card.
- **Kino** — the demo film.
