# HackProof

An interactive cyber attack & defense lab for expo visitors. Watch an attack hit a
fictional website, see what happens behind the scenes, then watch it get blocked.

All targets are fictional and run locally. No real brands, no real attack tooling.

## Run it

```bash
cd app
npm install
npm run dev        # open http://localhost:5173
```

Presenter screen: press **Ctrl + Shift + P**.

## Two modes (toggle on Home)

- **Cyber Security:** Home → pick a site → pick an attack → live attack (Normal Use, Run Attack, Defense ON/OFF, Reset in any order) → Report
- **Ethical Hacking:** Home → open an engagement → 6-phase operator console (Brief, Scan, Assess, Validate, Fix & retest, Report) → Report

Sites: ShopShield Store (3 attacks), PostHaven Mail (fake delivery message), TripTide Tickets (traffic flood).

## Where things live

| Path | What |
|---|---|
| `app/src/data/catalog.ts` | Sites and scenarios (add a site or attack = add data here) |
| `app/src/components/stages/` | Inbox and traffic-graph stages |
| `app/src/data/trace.ts` | Preview trace-event stream for the Behind the Scenes panel |
| `app/src/components/ShopShield.tsx` | The fictional ShopShield site (home, login, product, cart, orders) |
| `app/src/components/BehindTheScenes.tsx` | The 5-layer panel |
| `app/src/screens/` | One file per screen |

## Status

Front end with preview data. Scenario specifics and the lab backend come next.
