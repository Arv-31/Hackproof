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

## Visitor flow (6 screens)

Start → Module → Pick a target → Demo → Report → Presenter (staff only)

## Where things live

| Path | What |
|---|---|
| `app/src/data/catalog.ts` | Domains and scenarios (add a target = add data here) |
| `app/src/data/trace.ts` | Preview trace-event stream for the Behind the Scenes panel |
| `app/src/components/ShopShield.tsx` | The fictional ShopShield site (home, login, product, cart, orders) |
| `app/src/components/BehindTheScenes.tsx` | The 5-layer panel |
| `app/src/screens/` | One file per screen |

## Status

Front end with preview data. Scenario specifics and the lab backend come next.
