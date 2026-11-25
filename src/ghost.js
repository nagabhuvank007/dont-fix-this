// Works out what the polish took, at word level, so the reveal can ghost only
// the words that disappeared. On the reference letter the medium edit loses one
// word that matters — "you" — and ghosting the whole sentence would hide it.

const STOP = new Set(["a","an","the","and","or","but","of","to","in","for","on","at","is","am","are","was","were","be","been","it","that","this","i","my","me"]);

// Light stemming, so "scolding" -> "scolded" reads as a form change rather than a
// loss. What should ghost is a word that genuinely went: a person, a place, a detail.
const stem = (w) => w.replace(/(ing|ed|es|s)$/, "");
const words = (s) => (s.toLowerCase().match(/[a-z']+/g) || []).map(stem);
const key = (s) => s.replace(/\s+/g, " ").trim().toLowerCase().replace(/[^a-z0-9 ']/g, "");

export function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Which sentence in `after` best corresponds to `target`, and how close it is.
function bestMatch(target, after) {
  const t = new Set(words(target).filter((w) => !STOP.has(w)));
  if (!t.size) return { sentence: null, overlap: 0 };
  let best = { sentence: null, overlap: 0 };
  for (const s of sentences(after)) {
    const ws = new Set(words(s).filter((w) => !STOP.has(w)));
    let hit = 0;
    for (const w of t) if (ws.has(w)) hit++;
    const overlap = hit / t.size;
    if (overlap > best.overlap) best = { sentence: s, overlap };
  }
  return best;
}

export function outcomeFor(protectedSentence, after) {
  const target = key(protectedSentence);
  if (key(after).includes(target)) return { outcome: "verbatim", match: protectedSentence, lost: [] };

  const { sentence, overlap } = bestMatch(protectedSentence, after);
  if (!sentence || overlap < 0.34) return { outcome: "gone", match: sentence, lost: tokensOf(protectedSentence) };

  const keptSet = new Set(words(sentence));
  const lost = tokensOf(protectedSentence).filter((tok) => !keptSet.has(stem(tok.toLowerCase())));
  return { outcome: "semantic", match: sentence, lost };
}

function tokensOf(s) {
  return (s.match(/[A-Za-z']+/g) || []);
}

// Tokens of the protected sentence, each marked kept or lost, for in-place ghosting.
export function ghostTokens(protectedSentence, after) {
  const { outcome, match } = outcomeFor(protectedSentence, after);
  if (outcome === "verbatim") {
    return protectedSentence.split(/(\s+)/).map((t) => ({ t, lost: false }));
  }
  // Gone means no sentence corresponds to it. Every word of it is lost, and there
  // is nothing it "became" — claiming otherwise would put words in the edit's mouth.
  if (outcome === "gone") {
    return protectedSentence.split(/(\s+)/).map((t) => ({ t, lost: /[A-Za-z]/.test(t) }));
  }
  const keptSet = new Set(words(match || ""));
  return protectedSentence.split(/(\s+)/).map((t) => {
    const w = t.toLowerCase().replace(/[^a-z']/g, "");
    if (!w) return { t, lost: false };
    return { t, lost: !keptSet.has(stem(w)) };
  });
}
