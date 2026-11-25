# The design system

Built in Paper: **DON'T FIX THIS.**
https://app.paper.design/file/01M887M7944EAP5CWSWM4VXRRN

Mood: **bookish** — plaster, oak pew, ink, candle flame. Not a free choice. The app was
already shipping in this palette, and desyncing the design from the running code hours
before a demo would be vanity rather than craft.

## The one rule

```
--color-loss: #6D1F2B   /* Oxblood */
```

> ONLY the words the polish removed. The single colour moment in the piece; do not reuse
> it for buttons, links or borders.

That description is written into the token itself, in the design file.

In the first build of the app, oxblood did three jobs — buttons, borders and ghosts — so
it said nothing. Here it does one. The result is that **the only coloured thing in the
whole piece is what the AI took from you.** A constraint in the design system, not a
style preference.

## Palette

| token | value | role |
|---|---|---|
| `--color-paper` | `#F7F3EA` | plaster ground |
| `--color-paper-deep` | `#F1EBDD` | recessed paper — wells, unchosen cards |
| `--color-ink` | `#15120E` | all primary text |
| `--color-ink-soft` | `#4A443A` | secondary prose |
| `--color-ink-faint` | `#8D8578` | machine labels only, never body text |
| `--color-rule` | `#DDD4C2` | hairlines |
| `--color-loss` | `#6D1F2B` | the removed words, and nothing else |

## Type

**EB Garamond** for everything read as language. **Inter**, 11–13px, letterspaced 0.18em,
for everything spoken by a machine: step numbers, Pangram's verdict and its caveat.

The letter is human and the labels are not, and the typography says so before anyone
reads a word.

## Layout

An interactive literary exhibition, not a dashboard. One column at 820px, generous
margins, prose sitting directly on the paper. The only boxed element in the piece is
Pangram's verdict — the machine speaks in a box, the human speaks on bare paper.

## Screens designed
- **05 Reveal** — the protected sentence at 34px in ink, "you", "me" and "late" struck
  through in oxblood; the polished version below at 22px in soft ink behind a grey rule.
  The original dominates because that is the argument.
- **07 Closing** — Pangram's real verdict, the three branch lines, the final statement.
