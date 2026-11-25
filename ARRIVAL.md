# First 20 minutes at the venue

Order matters. Do these in sequence.

1. **Claim the tools.** Paper Pro (free during the event), Kino Pro, Capy Max.
   Install the Paper and Kino desktop apps while you eat — both failed earlier only
   because they are not installed.
2. **Start the app.** `cd ~/dont-fix-this && npm run dev` then open localhost:5173.
   Click through it once yourself before showing anyone.
3. **Collect letters.** Two or three people, two minutes each. See ADD_LETTER.md.
   This is the highest-value thing you can do with ten minutes.
4. **Then Capy.**

## Using Capy

The app already works, so do not have Capy rebuild it from scratch — you would spend
90 minutes arriving back where you started. Point Capy at the repo and give it real work.

Connect: Capy → Settings → Integrations → Paper, and link the GitHub repo
`nagabhuvank007/dont-fix-this`.

### Good tasks to give Capy, in order of value

1. **Score the protected sentence on its own.** Right now Pangram only reads the whole
   letter. Add a second detect call for the protected sentence alone and show its result
   beside the letter's on the closing screen. Real feature, visible in the demo, and it
   makes the reveal sharper.
2. **The receipt / poster export.** A button on the closing screen that renders the whole
   run as one printable page: the original, the chosen version, the ghosted sentence, the
   prediction, and Pangram's real verdict. Judges can keep it. This is also the Paper work.
3. **An add-a-letter screen.** Paste a letter, its three versions and the protected
   sentence, and have it write into server/letters.json. Lets you add letters at the venue
   without touching a file.
4. **Mobile.** The cards screen is tight on a phone. Judges may try it on theirs.

### What to tell Capy about the rules
- Originals are human-written and never generated. The machine edits; it never writes.
- The closing text is fixed strings in three lookup tables (src/endings.js). Never
  generate it at runtime.
- No key reaches the browser. Pangram and any editing model stay server-side.
- Never fabricate a score. If a call fails, say so.

## If Capy wants to build it fresh anyway
CAPY_BRIEF.md is the full spec. Let it run while you work on Kino — then keep whichever
version is better. You lose nothing by having two.

## Last hour
Screen-record the flow (KINO.md), cut the film, rehearse twice out loud (DEMO.md).
If you are behind at 8:30: the app ships complete, Kino gets cut to 15 seconds.
Never the other way around.
