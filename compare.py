# Scores the original and all three polish levels, plus the protected sentence alone.
# One key prompt. Nothing stored.
#   python compare.py
import json
from getpass import getpass
from pangram import Pangram

FILES = [("original", "letter.txt"), ("light", "v1_light.txt"),
         ("medium", "v2_medium.txt"), ("heavy", "v3_heavy.txt")]
PROTECTED = "I even miss you scolding me for sleeping late."

c = Pangram(api_key=getpass("Pangram API key: "))
rows = []
for name, path in FILES:
    t = open(path).read().strip()
    try:
        r = c.predict(t, public_dashboard_link=False, model="default")
    except Exception as e:
        print(f"{name}: FAILED {type(e).__name__}: {e}")
        continue
    rows.append((name, r))
    print(f"\n{'='*64}\n{name.upper()}  ({path})\n{'='*64}")
    print("headline:  ", r["headline"])
    print("human:     ", r["fraction_human"])
    print("ai:        ", r["fraction_ai"])
    print("assisted:  ", r["fraction_ai_assisted"])
    print("segments h/ai/assist:", r["num_human_segments"],
          r["num_ai_segments"], r["num_ai_assisted_segments"])
    print("prediction:", r["prediction"])

print(f"\n\n{'='*64}\nSUMMARY\n{'='*64}")
print(f"{'version':10} {'headline':22} {'human':>8} {'ai':>12}")
for name, r in rows:
    print(f"{name:10} {r['headline']:22} {r['fraction_human']:>8.4f} {r['fraction_ai']:>12.4e}")

print(f"\n{'='*64}\nTHE PROTECTED SENTENCE, SCORED ALONE\n{'='*64}")
print(repr(PROTECTED))
try:
    print(json.dumps(c.predict(PROTECTED, public_dashboard_link=False, model="default"), indent=2))
except Exception as e:
    print(f"predict_short failed: {type(e).__name__}: {e}")
