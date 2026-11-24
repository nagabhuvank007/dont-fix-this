# Scores one or more letters. Key prompted once, never stored.
#   ./.venv/bin/python pangram_test.py letter.txt letter_en.txt
import json, sys
from getpass import getpass
from pangram import Pangram

paths = sys.argv[1:] or ["letter.txt"]
texts = {}
for p in paths:
    try:
        t = open(p).read().strip()
    except FileNotFoundError:
        sys.exit(f"No {p}")
    if len(t.split()) < 50:
        sys.exit(f"{p}: under 50 words, predict() needs more.")
    texts[p] = t

client = Pangram(api_key=getpass("Pangram API key: "))

for p, t in texts.items():
    print("\n" + "=" * 60)
    print(f"{p}  ({len(t.split())} words)")
    print("=" * 60)
    try:
        r = client.predict(t, public_dashboard_link=False)
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")
        continue
    print("headline:       ", r["headline"])
    print("prediction:     ", r["prediction"], "|", r["prediction_short"])
    print("human:          ", r["fraction_human"])
    print("ai:             ", r["fraction_ai"])
    print("ai_assisted:    ", r["fraction_ai_assisted"])
    print("segments human/ai/assisted:",
          r["num_human_segments"], r["num_ai_segments"], r["num_ai_assisted_segments"])
    print("windows:")
    for w in r["windows"]:
        print("   ", json.dumps(w)[:200])
