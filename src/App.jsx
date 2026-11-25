import React, { useEffect, useMemo, useState } from "react";
import { sentences, outcomeFor, ghostTokens } from "./ghost.js";
import { closing } from "./endings.js";



const post = async (url, body) => {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = await r.json().catch(() => ({ error: "Bad response" }));
  if (!r.ok) throw new Error(d.error || `${r.status}`);
  return d;
};

const shuffle = (a) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

export default function App() {
  const [screen, setScreen] = useState("write");
  const [text, setText] = useState("");
  const [protectedSentence, setProtected] = useState(null);
  const [predicted, setPredicted] = useState(null);
  const [deck, setDeck] = useState([]);
  const [firstPick, setFirstPick] = useState(null);
  const [pick, setPick] = useState(null);
  const [detection, setDetection] = useState(null);
  const [detectionErr, setDetectionErr] = useState(null);
  const [sentenceDetection, setSentenceDetection] = useState(null);
  const [sentenceErr, setSentenceErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState([]);
  const [canWriteOwn, setCanWriteOwn] = useState(true);
  const [own, setOwn] = useState(false);
  const [err, setErr] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Keep the shape of a letter: paragraphs, each split into pickable sentences.
  const paras = useMemo(
    () => text.split(/\n\s*\n/).map((p) => ({ raw: p, parts: sentences(p) })).filter((p) => p.parts.length),
    [text]
  );

  useEffect(() => {
    fetch("/api/letters").then((r) => r.json()).then((d) => setLibrary(d.letters || [])).catch(() => {});
    fetch("/api/health").then((r) => r.json()).then((d) => setCanWriteOwn(!!d.llm)).catch(() => {});
  }, []);

  const reset = () => {
    setScreen("write"); setText(""); setProtected(null); setPredicted(null);
    setDeck([]); setFirstPick(null); setPick(null); setDetection(null); setErr(null); setOwn(false);
    setDetectionErr(null); setSentenceDetection(null); setSentenceErr(null);
  };

  async function generate() {
    setBusy(true); setErr(null);
    try {
      const { versions } = await post("/api/rewrite", { text });
      setDeck(shuffle([{ level: "original", text }, ...versions]));
      setScreen("choose");
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  // Both readings go out together, only once the participant has chosen to send.
  // Each settles on its own: a failure leaves its result null and records why.
  async function detect(chosen) {
    setBusy(true); setErr(null);
    const [letter, sentence] = await Promise.allSettled([
      post("/api/detect", { text: chosen.text }),
      post("/api/detect-sentence", { sentence: protectedSentence }),
    ]);
    setDetection(letter.status === "fulfilled" ? letter.value : null);
    setDetectionErr(letter.status === "rejected" ? letter.reason.message : null);
    setSentenceDetection(sentence.status === "fulfilled" ? sentence.value : null);
    setSentenceErr(sentence.status === "rejected" ? sentence.reason.message : null);
    setBusy(false);
  }

  const chosen = pick;
  const result = chosen ? outcomeFor(protectedSentence || "", chosen.text) : null;
  const switched = firstPick && chosen && firstPick.level !== chosen.level;

  // ---------- 01 WRITE ----------
  if (screen === "write")
    return (
      <Shell step="01 — write" wide={!own}>
        {own ? (
          <>
            <h1>Write something that matters.</h1>
            <p className="lede">
              Not an essay. Not a prompt. Something you would actually say to someone.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dear…"
              spellCheck={false}
            />
            <div className="row">
              <button disabled={wordCount < 50} onClick={() => setScreen("protect")}>
                Continue
              </button>
              <button className="ghost" onClick={() => { setOwn(false); setText(""); }}>
                Back
              </button>
              <span className="spacer" />
              <span className="hint">
                {wordCount} words{wordCount < 50 ? " — 50 needed" : ""}
              </span>
            </div>
          </>
        ) : (
          <>
            <h1>Start with a letter that matters.</h1>
            <p className="lede">
              Each of these was written by hand, by the person who signed it, before any of
              this ran. That is the one rule here: the machine edits, it never writes.
            </p>
            <div className="cards">
              {library.map((l) => (
                <button key={l.id} className="card" onClick={() => { setText(l.original); setScreen("protect"); }}>
                  <span className="mark">{l.author} — to {l.to}</span>
                  <span className="body">{l.original}</span>
                  {l.blurb && <span className="note">{l.blurb}</span>}
                </button>
              ))}
            </div>
            <div className="row">
              <button
                className="ghost"
                disabled={!canWriteOwn}
                onClick={() => setOwn(true)}
                title={canWriteOwn ? "" : "No editing model configured on this copy"}
              >
                Write your own instead
              </button>
              {!canWriteOwn && (
                <span className="hint">
                  This copy has no editing model, so a new letter cannot be edited here.
                </span>
              )}
            </div>
          </>
        )}
      </Shell>
    );

  // ---------- 02 PROTECT ----------
  if (screen === "protect")
    return (
      <Shell step="02 — protect">
        <h1>Select the sentence you would hate to lose.</h1>
        <p className="lede">One sentence. The one that would hurt to see go.</p>
        <div className="letter pick">
          {paras.map((p, pi) => (
            <p key={pi} className="para">
              {p.parts.map((s, i) => (
                <span
                  key={i}
                  className={protectedSentence === s ? "on" : ""}
                  onClick={() => setProtected(s)}
                >
                  {s}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
        <div className="row">
          <button disabled={!protectedSentence} onClick={() => setScreen("predict")}>
            Continue
          </button>
          <button className="ghost" onClick={() => setScreen("write")}>Back</button>
        </div>
      </Shell>
    );

  // ---------- 03 PREDICT ----------
  if (screen === "predict")
    return (
      <Shell step="03 — predict">
        <h1>Will this sentence survive?</h1>
        <div className="sentence-box">{protectedSentence}</div>
        <p className="lede">
          Answer before anything is written. You will not get to change this.
        </p>
        <div className="row">
          <button onClick={() => { setPredicted("survive"); generate(); }} disabled={busy}>
            {busy ? "Editing…" : "Yes, it survives"}
          </button>
          <button className="ghost" onClick={() => { setPredicted("lost"); generate(); }} disabled={busy}>
            No, it goes
          </button>
        </div>
        {err && <p className="err">{err}</p>}
      </Shell>
    );

  // ---------- 04 CHOOSE ----------
  if (screen === "choose")
    return (
      <Shell step="04 — choose" widest>
        <h1>Which letter would you send?</h1>
        <p className="lede">
          You will recognise your own. What is hidden is how hard each one was edited.
        </p>
        <div className="cards four">
          {deck.map((v, i) => (
            <button
              key={v.level}
              className={`card${pick?.level === v.level ? " on" : ""}`}
              onClick={() => { setPick(v); if (!firstPick) setFirstPick(v); }}
            >
              <span className="mark">{String.fromCharCode(65 + i)}</span>
              <span className="body">{v.text}</span>
            </button>
          ))}
        </div>
        <div className="row">
          <button disabled={!pick} onClick={() => setScreen("reveal")}>
            Send this one
          </button>
        </div>
      </Shell>
    );

  // ---------- 05 REVEAL ----------
  if (screen === "reveal") {
    const tokens = ghostTokens(protectedSentence, chosen.text);
    const label = { original: "your own letter, untouched", light: "lightly edited",
                    medium: "edited for clarity", heavy: "heavily polished" }[chosen.level];
    return (
      <Shell step="05 — reveal" wide>
        <h1>{result.outcome === "verbatim" ? "It survived." : result.outcome === "semantic" ? "Some of it survived." : "It is gone."}</h1>
        <p className="lede">You chose {label}. You predicted it would {predicted === "survive" ? "survive" : "be lost"}.</p>

        <div className="ghosted">
          {tokens.map((t, i) =>
            t.lost
              ? <span key={i} className="lost" data-w={t.t}>{t.t}</span>
              : <span key={i} className="kept">{t.t}</span>
          )}
        </div>

        {result.outcome === "semantic" && result.match && (
          <>
            <p className="hint">became</p>
            <div className="sentence-box">{result.match}</div>
          </>
        )}

        {result.lost.length > 0 && (
          <p className="became">
            {result.lost.length} word{result.lost.length === 1 ? "" : "s"} did not come back:{" "}
            {result.lost.map((w) => `“${w}”`).join(", ")}.
          </p>
        )}

        <div className="row">
          <button onClick={() => { setScreen("final"); }}>Continue</button>
          <button className="ghost" onClick={() => setScreen("choose")}>Choose again</button>
        </div>
      </Shell>
    );
  }

  // ---------- 06 FINAL ----------
  if (screen === "final")
    return (
      <Shell step="06 — the final choice" wide>
        <h1>Knowing what changed, would you still send it?</h1>
        <div className="card" style={{ cursor: "default" }}>
          <span className="body">{chosen.text}</span>
        </div>
        <div className="row">
          <button disabled={busy} onClick={async () => { await detect(chosen); setScreen("closing"); }}>
            {busy ? "Reading…" : "Yes, send it"}
          </button>
          <button className="ghost" onClick={() => setScreen("choose")}>No, choose another</button>
        </div>
        {err && <p className="err">{err}</p>}
      </Shell>
    );

  // ---------- CLOSING ----------
  const c = closing({ predicted, outcome: result.outcome, level: chosen.level, switched, detection });
  return (
    <Shell step="don't fix this" wide>
      <div className="verdicts">
        <Verdict title="Pangram — the whole letter you sent" result={detection} error={detectionErr} />
        <Verdict
          title="Pangram — your protected sentence alone"
          result={sentenceDetection}
          error={sentenceErr}
          quote={protectedSentence}
        />
      </div>
      <p className="hint">
        Authorship assessments. Not a measure of writing quality, meaning or sincerity.
      </p>
      <div className="closing">
        {c.lines.map((l, i) => <p key={i}>{l}</p>)}
      </div>
      <p className="final">{c.final}</p>
      <div className="row">
        <button className="ghost" onClick={reset}>Start again</button>
      </div>
    </Shell>
  );
}

const shown = (v) => (v === null || v === undefined ? "not returned" : String(v));

function Verdict({ title, result, error, quote }) {
  const confidence = result?.windows?.map((w) => w.confidence).filter(Boolean) ?? [];
  return (
    <div className="verdict">
      <div className="h">{title}</div>
      {quote && <div className="q">“{quote}”</div>}
      {error ? (
        <>
          <div className="v">No reading.</div>
          <div className="n err">This call failed: {error}</div>
        </>
      ) : result ? (
        <>
          <div className="v">{shown(result.headline)}</div>
          <div className="n">{shown(result.prediction)}</div>
          <div className="n">
            human {shown(result.fraction_human)} · ai {shown(result.fraction_ai)} · ai-assisted{" "}
            {shown(result.fraction_ai_assisted)}
          </div>
          <div className="n">
            confidence {confidence.length ? confidence.join(" / ") : "not returned"} · calibrated{" "}
            {shown(result.calibrated_confidence)}
          </div>
          {result.word_count < 50 && (
            <div className="n">
              {result.word_count} words. Pangram asks for 50 or more, so this reading is less
              reliable than the letter's.
            </div>
          )}
        </>
      ) : (
        <div className="n err">No result was received.</div>
      )}
    </div>
  );
}

function Shell({ step, wide, widest, children }) {
  return (
    <>
      <div className={`stage fade${widest ? " widest" : wide ? " wide" : ""}`}>
        <div className="step">{step}</div>
        {children}
      </div>
      <div className="foot">
        Nothing is sent to anyone. Letters are not stored. — DON'T FIX THIS.
      </div>
    </>
  );
}
