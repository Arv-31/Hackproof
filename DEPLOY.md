# Deploying HackProof (private, invite-only)

HackProof is hosted on **Cloudflare Pages** and locked with **Cloudflare Access**, so only the Google accounts you list can open it. Free for up to 50 users.

## 1. Host the site (Cloudflare Pages)

1. Sign in at https://dash.cloudflare.com (create a free account if needed).
2. **Workers & Pages → Create → Pages → Connect to Git**, pick the `Arv-31/Hackproof` repo.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Vite |
   | Root directory | `app` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Save and Deploy.** You get a URL like `https://hackproof.pages.dev`.
   Every push to `main` redeploys automatically.

## 2. Lock it to chosen Gmail accounts (Cloudflare Access)

1. In the dashboard open **Zero Trust** (first time: pick a team name and the Free plan).
2. **Settings → Authentication → Login methods → Add new → Google.**
   Follow the on-screen steps (it asks for a Google OAuth client ID and secret).
   If you skip this, "One-time PIN" is on by default: users get a code by email instead.
3. **Access → Applications → Add an application → Self-hosted.**
   - Application domain: `hackproof.pages.dev` (and also `*.hackproof.pages.dev` so preview builds are locked too).
4. Add a policy:
   - Action: **Allow**
   - Include → **Emails** → type each allowed Gmail address.
5. Save. Visiting the site now shows a Cloudflare login page; only listed emails get in.

**Add or remove people** any time: Access → Applications → HackProof → Policies → edit the email list. Changes apply within a minute.

## Check it

- Open the site in a private window: you should see the Cloudflare login, not HackProof.
- Sign in with an allowed Gmail: HackProof opens.
- Sign in with any other account: access denied.

## Notes

- Everything in HackProof is a front-end simulation of fictional sites. Nothing deliberately vulnerable runs on the server.
- If a real lab backend is added later, keep it off the internet as the project guide says, and run it only on the presenter's laptop.
