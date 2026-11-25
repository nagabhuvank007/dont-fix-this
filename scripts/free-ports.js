// Frees the dev ports before starting, so a server left running in another
// terminal tab doesn't block the restart.
import { execSync } from "node:child_process";

for (const port of [8787, 5173]) {
  try {
    const pids = execSync(`lsof -ti tcp:${port}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim().split("\n").filter(Boolean);
    for (const pid of pids) {
      try { process.kill(Number(pid), "SIGTERM"); console.log(`freed port ${port} (pid ${pid})`); }
      catch {}
    }
  } catch { /* nothing listening */ }
}
