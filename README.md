# HackProof

HackProof is an interactive cyber attack and defense lab built for expo visitors. Pick a fictional website, watch an attack succeed, look behind the scenes at what happened, switch the defense on, and prove the same attack now fails.

It has two modes:

- **Cyber Security**: guided live attacks on four fictional sites (shop, mail, tickets, clinic), covering web attacks, password guessing, phishing, AI prompt injection, ransomware on dummy files and traffic floods.
- **Ethical Hacking**: a six-phase operator console (brief, scan, assess, validate, fix and retest, report).

## Run it

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173. Presenter controls: **Ctrl + Shift + P**.

To deploy: `cd app && npm run build && npx wrangler deploy`.

---

**All websites in HackProof are fictional and every attack runs only inside the lab.**
