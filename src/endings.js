// Fixed strings. Nothing here is generated at runtime, and that is deliberate:
// a piece arguing that generated words lose what matters cannot have a
// generated ending.

export const PREDICTION = {
  survive: {
    verbatim: "You thought it would survive. It did — every word.",
    semantic: "You thought it would survive. The meaning did. The words didn't, and one of them mattered.",
    gone: "You thought it would survive. It isn't in there anymore.",
  },
  lost: {
    verbatim: "You expected to lose it. The edit left it alone. Not everything polish touches, it takes.",
    semantic: "You expected to lose it. What came back says the same thing with the specifics filed off.",
    gone: "You expected to lose it, and you were right. You knew exactly what was at risk, and it went anyway.",
  },
};

export const CHOICE = {
  original: "You kept your own words. Most people don't.",
  original_after_switch: "You almost sent the edited one. Then you saw what it cost, and went back.",
  light: "You took the version that fixed your commas and otherwise left you alone. That is the cheapest trade in here.",
  polished: "You read them all and chose the one that sounds better. Nobody made you. That's the part worth noticing.",
  polished_after_switch: "You had your own letter in your hand, saw the price, and traded it anyway. That is a real answer to the question, and not an embarrassing one.",
};

export const DETECTOR = {
  human: "Pangram reads this as human-written. It is telling you who typed it — not whether it was worth sending.",
  ai: "Pangram reads this as machine-written, and it is right about that. It has no opinion on whether you should send it. That was never a question a detector could answer.",
  ai_but_chose_original: "Pangram reads your own writing as machine-written. It is wrong. Detectors are wrong sometimes — which is exactly why nothing here let it decide anything that mattered.",
  mixed: "Pangram reads this as partly machine-written, which is accurate: it is. The number can tell you that much, and nothing beyond it.",
  error: "Pangram didn't answer. The score was never the point. What you chose is still what you chose.",
};

export const FINAL = "AI can make your words better. Only you can decide what better means.";

export function verdictFor(detection, choiceKey) {
  if (!detection) return "error";
  const h = detection.headline || "";
  const chosenOriginal = choiceKey.startsWith("original");
  if (/^AI/i.test(h)) return chosenOriginal ? "ai_but_chose_original" : "ai";
  if (/mixed|assisted/i.test(h)) return "mixed";
  if (detection.fraction_ai_assisted > 0.5) return "mixed";
  return "human";
}

export function choiceKey(level, switched) {
  if (level === "original") return switched ? "original_after_switch" : "original";
  if (level === "light") return "light";
  return switched ? "polished_after_switch" : "polished";
}

export function closing({ predicted, outcome, level, switched, detection }) {
  const ck = choiceKey(level, switched);
  return {
    lines: [
      PREDICTION[predicted][outcome],
      CHOICE[ck],
      DETECTOR[verdictFor(detection, ck)],
    ],
    final: FINAL,
  };
}
