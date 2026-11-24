# Confirms the key works and the NONSLOP credit redeemed. No letter needed.
import json
from getpass import getpass
from pangram import Pangram

c = Pangram(api_key=getpass("Pangram API key: "))
for name in ("get_balance", "get_limits", "get_usage"):
    try:
        print(f"\n{name}:", json.dumps(getattr(c, name)(), indent=2))
    except Exception as e:
        print(f"\n{name} failed: {type(e).__name__}: {e}")
