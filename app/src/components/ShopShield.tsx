import type { Phase, SitePage } from '../types'

const PAGES: SitePage[] = ['home', 'login', 'product', 'cart', 'orders']
const PRODUCTS = [
  { name: 'Aurora Desk Lamp', price: '₹1,499', bg: 'from-[#cfeee9] to-[#9ad8cf]' },
  { name: 'Pebble Mug', price: '₹299', bg: 'from-[#e6e1f7] to-[#c3b8ec]' },
  { name: 'Drift Notebook', price: '₹249', bg: 'from-[#fbe7cf] to-[#f4c995]' },
]

interface Props {
  page: SitePage
  onPage?: (p: SitePage) => void
  /** Which scenario is driving the page, and where it is in the run. */
  scenario?: string
  phase?: Phase | null
}

const Bad = ({ children }: { children: React.ReactNode }) => <div className="animate-pop rounded-xl bg-[#7f1d1d] px-4 py-2.5 text-sm font-semibold text-white">{children}</div>
const Good = ({ children }: { children: React.ReactNode }) => <div className="animate-pop rounded-xl bg-[#14532d] px-4 py-2.5 text-sm font-semibold text-white">{children}</div>
const Field = ({ label, value, hot }: { label: string; value: string; hot?: boolean }) => (
  <label className="grid gap-1">
    <span className="text-xs font-semibold text-slate-500">{label}</span>
    <span className={`rounded-lg border px-3 py-2.5 text-[14.5px] ${hot ? 'border-attack bg-red-50 font-semibold text-red-700' : 'border-slate-200 bg-white'}`}>{value}</span>
  </label>
)

export function ShopShield({ page, onPage, scenario, phase }: Props) {
  const active = (id: string) => scenario === id
  const attacked = phase === 'attack'
  const retested = phase === 'retest'
  const orderNo = active('orders') && (attacked || retested) ? '10518' : '10517'
  const url = page === 'orders' ? `orders/${orderNo}` : page

  return (
    <div className="overflow-hidden rounded-[20px] border border-navy-line bg-[#F7F9FC] text-[#1b2a3d]">
      <div className="flex items-center gap-3 bg-[#e6ebf2] px-4 py-2.5">
        <div className="flex gap-1.5">{[0, 1, 2].map(i => <i key={i} className="h-3 w-3 rounded-full bg-[#c3ccd8]" />)}</div>
        <div className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-1 font-mono text-[13px] text-slate-600">
          shopshield.lab/<span className={orderNo === '10518' && page === 'orders' ? 'rounded bg-red-100 px-1 text-red-700' : ''}>{url}</span>
        </div>
      </div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[13px] font-semibold text-amber-800">
        ⚠ Fictional lab site. Not a real store. Nothing here leaves this computer.
      </div>
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-4 py-3">
        <span className="mr-auto font-display text-xl font-extrabold text-brand">ShopShield</span>
        {PAGES.map(p => (
          <button key={p} onClick={() => onPage?.(p)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${p === page ? 'bg-teal-50 font-semibold text-brand' : 'text-slate-600'}`}>{p === 'cart' ? 'Cart' : p}</button>
        ))}
      </div>

      <div className="grid min-h-[340px] content-start gap-4 p-5">
        {page === 'home' && (
          <>
            <div className="rounded-2xl bg-gradient-to-r from-brand to-teal p-6 text-white">
              <h4 className="font-display text-2xl font-bold">Everyday things, delivered.</h4>
              <p className="opacity-90">A pretend store built for this lab.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-400">Search lamps, mugs, notebooks…</div>
            <div className="grid grid-cols-3 gap-3">
              {PRODUCTS.map(p => (
                <div key={p.name} className="grid gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${p.bg}`} />
                  <b>{p.name}</b><span className="font-semibold text-brand">{p.price}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'login' && (
          <div className="grid max-w-sm gap-3">
            <h4 className="font-display text-2xl font-bold">Sign in</h4>
            <Field label="Email" value={active('login') && (attacked || retested) ? '[lab test input]' : 'meera@shopshield.lab'} hot={active('login') && (attacked || retested)} />
            <Field label="Password" value={active('login') && (attacked || retested) ? '(not the real password)' : '••••••••••'} />
            <button className="justify-self-start rounded-lg bg-brand px-4 py-2 text-sm text-white">Sign in</button>
            {active('login') && phase === 'normal' && <Good>Signed in as Meera. This is a normal sign-in.</Good>}
            {active('login') && attacked && <Bad>Signed in as Admin without the right password. (lab result)</Bad>}
            {active('login') && retested && <Good>Sign-in refused. Email or password is wrong.</Good>}
            <small className="text-amber-700">Demo accounts only. Never type a real password here.</small>
          </div>
        )}

        {page === 'product' && (
          <>
            <div className="grid gap-5 sm:grid-cols-[150px_1fr]">
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${PRODUCTS[0].bg}`} />
              <div className="grid content-start gap-1">
                <h4 className="font-display text-2xl font-bold">Aurora Desk Lamp</h4>
                <span className="text-xl font-bold text-brand">₹1,499</span>
                <p className="text-slate-500">Warm LED lamp with three brightness levels.</p>
                <button className="mt-2 justify-self-start rounded-lg bg-brand px-4 py-2 text-sm text-white">Add to cart</button>
              </div>
            </div>
            <b className="font-display">Customer reviews</b>
            <Review who="meera_k" stars={4} text="Bright and simple. Good value." />
            <Review who="arjun.r" stars={5} text="Looks great on my desk." />
            {active('reviews') && phase === 'normal' && <Review who="kavya.s" stars={5} text="Arrived quickly, works well." />}
            {active('reviews') && attacked && (
              <div className="grid gap-2 rounded-xl border border-attack bg-red-50 px-4 py-3 text-sm">
                <span><b>guest_4471</b> <span className="text-amber-500">★★★★★</span></span>
                <span>Great lamp! <span className="rounded bg-red-100 px-1.5 font-mono text-xs text-red-700">[hidden test code]</span></span>
                <Bad>A test banner just ran from inside this review. (harmless lab test)</Bad>
              </div>
            )}
            {active('reviews') && retested && (
              <div className="grid gap-2 rounded-xl border border-defense bg-green-50 px-4 py-3 text-sm">
                <span><b>guest_4471</b> <span className="text-amber-500">★★★★★</span></span>
                <span>Great lamp! <span className="rounded bg-slate-100 px-1.5 font-mono text-xs">[hidden test code shown as plain text]</span></span>
                <Good>Nothing ran. The review is shown as plain text only.</Good>
              </div>
            )}
          </>
        )}

        {page === 'cart' && (
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500"><th className="py-2">Item</th><th>Qty</th><th className="text-right">Price</th></tr></thead>
              <tbody>
                <tr className="border-t border-slate-200"><td className="py-2">Aurora Desk Lamp</td><td>1</td><td className="text-right">₹1,499</td></tr>
                <tr className="border-t border-slate-200"><td className="py-2">Pebble Mug</td><td>2</td><td className="text-right">₹598</td></tr>
              </tbody>
            </table>
            <div className="grid content-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <b className="font-display text-lg">Checkout</b>
              <div className="flex justify-between"><span>Subtotal</span><span>₹2,097</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₹0</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold"><span>Total</span><span>₹2,097</span></div>
              <button className="mt-1 rounded-lg bg-brand px-4 py-2 text-white">Place order</button>
            </div>
          </div>
        )}

        {page === 'orders' && (
          <>
            <h4 className="font-display text-2xl font-bold">Your orders</h4>
            {!(active('orders') && (attacked || retested)) && (
              <div className="grid gap-1 rounded-xl border border-slate-200 bg-white p-4 text-sm">
                <b>Order #SS-10517 · Meera K.</b><span>Aurora Desk Lamp, Pebble Mug ×2 · ₹2,097 · Shipped</span>
                {active('orders') && phase === 'normal' && <Good>Meera sees her own order. This is normal.</Good>}
              </div>
            )}
            {active('orders') && attacked && (
              <div className="grid gap-2 rounded-xl border border-attack bg-red-50 p-4 text-sm">
                <b>Order #SS-10518 · Arjun R.</b><span>Drift Notebook · ₹249 · 14 Lake View Rd (fictional address)</span>
                <Bad>Meera is looking at Arjun's order and address. (lab result)</Bad>
              </div>
            )}
            {active('orders') && retested && <Good>Access denied. Order #SS-10518 belongs to another customer.</Good>}
          </>
        )}
      </div>
    </div>
  )
}

function Review({ who, stars, text }: { who: string; stars: number; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm">
      <b>{who}</b> <span className="text-amber-500">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
      <div>{text}</div>
    </div>
  )
}
