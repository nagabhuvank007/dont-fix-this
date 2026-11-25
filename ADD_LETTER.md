# Adding a real letter at the venue

The strongest version of this demo is three or four letters written by people in the
room tonight. Real letters, by real people, in front of the judges. Nobody else will
have that.

## Getting one (2 minutes per person)
Ask: *"Write a short letter to someone you actually know. Four or five sentences,
120 words-ish. Don't try to write well — that's the point."*

Then ask them to tell you which sentence they'd hate to lose, and write it down.

Get their OK to show it to judges. If it's private, don't use it.

## Adding it
1. Save the letter as a text file, e.g. `letters/priya.txt`.
2. Paste it to Claude and ask for the three polish levels. The originals must be human;
   the polished versions are machine, and that is the whole point.
3. Add the entry to `server/letters.json`:

```json
{
  "id": "priya-dad",
  "author": "Priya",
  "to": "her father",
  "blurb": "Written at the hackathon, 24 Nov.",
  "original": "...",
  "suggested": "the sentence she said she'd hate to lose",
  "versions": [
    { "level": "light",  "text": "..." },
    { "level": "medium", "text": "..." },
    { "level": "heavy",  "text": "..." }
  ]
}
```

The API reloads on save (`node --watch`), so the new letter appears immediately.

## Why this is worth ten minutes
"Here are four letters written by people in this room tonight, and here is what polish
took from each one" is a much stronger demo than one letter and a stock example. It also
answers the obvious challenge — *does this only work on your letter?* — before it's asked.

## The rule, again
Never generate an original. If the letter is machine-written, Pangram flags the
centrepiece and the piece argues against itself.
