import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroYork from "@/assets/hero-york.jpg";
import aboutInterior from "@/assets/about-interior.jpg";
import gableKeyIcon from "@/assets/gable-key-icon.png";

// Absolute fallback so the form works when the site is served from a non-Lovable
// origin (Netlify, custom domain). The Lovable-hosted backend accepts CORS from any origin.
const LOVABLE_API_ORIGIN = "https://project--c2a91baa-3dbe-4785-ba31-c13a9a2e2c6a.lovable.app";
function estimateEndpoint() {
  if (typeof window === "undefined") return "/api/public/estimate";
  const host = window.location.hostname;
  const sameOrigin = host === "localhost" || host.endsWith("lovable.app") || host.endsWith("lovable.dev");
  return `${sameOrigin ? "" : LOVABLE_API_ORIGIN}/api/public/estimate`;
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Gable & Key | Airbnb Property Management York" },
    { name: "description", content: "Gable & Key manages your Airbnb completely — guest comms, pricing, check-ins and more. York-based co-hosting service. 20% fee, no upfront costs. Indicative estimates only." },
    { property: "og:title", content: "Gable & Key | Airbnb Property Management York" },
    { property: "og:description", content: "York-based Airbnb co-hosting. 20% fee, no setup fee. Request a free, no-obligation indicative income estimate." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const services = [
  ["01", "Listing optimisation", "Professional descriptions and coordinating professional photography to help your listing stand out."],
  ["02", "Dynamic pricing", "Smart rates tuned to York events and real-time demand."],
  ["03", "Guest communications", "Every message handled promptly and professionally."],
  ["04", "Check-in coordination", "Seamless self check-in every time."],
  ["05", "Calendar management", "Careful calendar coordination to reduce gaps and avoid double bookings."],
  ["06", "Monthly reporting", "Clear income statements every month, no surprises."],
];

const steps = [
  ["01", "Free consultation", "We assess your property and share a realistic income estimate."],
  ["02", "We set everything up", "Listing, pricing, messaging — all done before the first booking."],
  ["03", "Bookings arrive", "We manage guests end to end. You stay informed, never burdened."],
  ["04", "You get paid", "Monthly transfer, clear statement, our percentage deducted."],
];

const faqs = [
  ["Do I need to already be on Airbnb?", "No. If your property isn't listed yet, we set everything up from scratch. If it's already live, we take over and optimise."],
  ["What's your fee?", "20% of gross booking revenue. No setup fees, no monthly retainers, no charge during empty periods. You only pay when you earn."],
  ["Will I still have control?", "Absolutely. You see every booking, set blackout dates for personal use, and approve house rules. It's your property — we run the day-to-day."],
  ["What if I want to stop?", "After the initial 3-month term, 30 days' written notice ends the arrangement. Confirmed bookings are honoured unless you direct otherwise."],
  ["Who pays for cleaning?", "You pay the cleaner directly. We coordinate the cleans and add no markup."],
  ["What do you need from me?", "Access to the property, house details, any existing listing, and your insurance and safety certificates."],
  ["Do I need permission from my mortgage lender or landlord?", "Often yes. Check your mortgage terms or lease before listing. We'll go through this with you before going live."],
  ["What rules apply in York?", "We'll check the current requirements with you before going live, including insurance, safety and any local rules, which are changing."],
  ["Do I need special insurance?", "Standard residential insurance doesn't cover short-term letting. We'll advise you on what you need before going live."],
];

function Landing() {
  return (
    <div className="min-h-screen bg-espresso text-cream font-sans">
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Services />
      <HowItWorks />
      <WhyGableKey />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 py-6 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2 sm:gap-3 shrink-0" aria-label="Gable & Key home">
          <img src={gableKeyIcon} alt="Gable & Key terracotta house-and-key emblem" className="h-11 md:h-12 w-auto object-contain" />
          <span className="font-serif text-cream text-[20px] leading-none tracking-normal">Gable &amp; Key</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[13px] text-cream/80 font-light">
          <a href="#services" className="hover:text-cream transition-colors">Services</a>
          <a href="#how" className="hover:text-cream transition-colors">How it works</a>
          <a href="#about" className="hover:text-cream transition-colors">About</a>
        </nav>
        <a
          href="#cta"
          className="text-[10px] tracking-normal sm:tracking-[0.18em] uppercase font-medium border border-cream/30 text-cream px-3 sm:px-4 py-2.5 hover:border-cream hover:bg-cream/5 transition-colors"
        >
          Free Estimate
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroYork}
        alt="Historic York street and York Minster at dusk"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-near-black/70 via-espresso/75 to-espresso" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-32 pb-24">
        <p className="label-eyebrow mb-8">York & North Yorkshire · Short-term Rental Management</p>
        <h1 className="font-serif text-cream text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.02]">
          Your property.<br />
          <span className="italic font-serif text-cream/95">Effortlessly managed.</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-cream/70 text-base sm:text-lg font-light leading-relaxed">
          We run your Airbnb from listing to checkout — our service aims to help you earn more while doing less.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="h-auto rounded-none shadow-none bg-terracotta text-off-white text-[11px] tracking-[0.18em] uppercase font-medium px-8 py-4 hover:brightness-110 transition-all"
          >
            Free Estimate
          </a>
          <a
            href="#how"
            className="border border-cream/30 text-cream text-[11px] tracking-[0.18em] uppercase font-medium px-8 py-4 hover:border-cream hover:bg-cream/5 transition-colors"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    ["20%", "Management fee"],
    ["No", "Setup fee"],
    ["30 days", "Exit notice"],
  ];
  return (
    <section className="bg-espresso border-y border-cream/10">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-cream/10">
        {stats.map(([n, l]) => (
          <div key={l} className="py-14 md:py-16 text-center">
            <div className="font-serif text-5xl md:text-6xl text-amber-warm">{n}</div>
            <div className="mt-4 text-[10px] tracking-[0.22em] uppercase text-cream/50 font-medium">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-espresso py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={aboutInterior}
            alt="Boutique-style property interior with elegant furnishings"
            loading="lazy"
            width={1200}
            height={1400}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="label-eyebrow mb-6">About Gable & Key</p>
          <h2 className="font-serif text-cream text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
            We manage your Airbnb <span className="italic">like it's our own.</span>
          </h2>
          <p className="mt-8 text-cream/70 text-base md:text-lg font-light leading-relaxed max-w-lg">
            York is one of the UK's most visited cities — but great properties underperform every day due to poor management. Gable & Key exists to close that gap and aims to help you earn more — income is not guaranteed. We're a focused, local co-hosting service that treats every property with the attention it deserves.
          </p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-near-black py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="label-eyebrow mb-6">What we do</p>
          <h2 className="font-serif text-cream text-4xl md:text-5xl lg:text-6xl">
            Everything, <span className="italic">handled.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-cream/10">
          {services.map(([n, t, d]) => (
            <div key={n} className="border-b border-r border-cream/10 p-10 md:p-12">
              <div className="font-serif text-5xl text-terracotta/40">{n}</div>
              <h3 className="mt-8 font-serif text-2xl text-cream">{t}</h3>
              <p className="mt-3 text-cream/60 text-sm font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="bg-espresso py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="label-eyebrow mb-6">How it works</p>
          <h2 className="font-serif text-cream text-4xl md:text-5xl lg:text-6xl">
            Up and running <span className="italic">in weeks, not months.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-cream/10">
          {steps.map(([n, t, d], i) => (
            <div key={n} className={`px-6 md:px-8 py-8 ${i === 0 ? "" : "border-t md:border-t-0 border-cream/10"}`}>
              <div className="font-serif text-4xl text-terracotta/50">{n}</div>
              <h3 className="mt-6 font-serif text-xl text-cream">{t}</h3>
              <p className="mt-3 text-cream/60 text-sm font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyGableKey() {
  const reasons = [
    ["Based in York", "Local to the city and its visitor calendar."],
    ["You stay the host", "The property and the Airbnb account remain yours."],
    ["You only pay when you earn", "20% of booking revenue, no setup fee, no retainer."],
    ["No long lock-in", "3-month initial term, then 30 days' notice."],
  ];
  return (
    <section className="bg-near-black py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-cream text-4xl md:text-5xl text-center mb-16">Why Gable &amp; Key</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-cream/10">
          {reasons.map(([title, description]) => (
            <div key={title} className="border-b border-r border-cream/10 p-10 md:p-12">
              <h3 className="font-serif text-2xl text-cream">{title}</h3>
              <p className="mt-3 text-cream/60 text-sm font-light leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-espresso py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 md:mb-16">
          <p className="label-eyebrow mb-6">Questions</p>
          <h2 className="font-serif text-cream text-4xl md:text-5xl">
            Good to <span className="italic">know.</span>
          </h2>
        </div>
        <div className="border-t border-cream/10">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-cream/10">
                <Button
                  variant="ghost"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full h-auto rounded-none whitespace-normal px-0 py-6 md:py-7 flex items-center justify-between gap-6 text-left hover:bg-transparent"
                >
                  <span className="font-serif text-lg md:text-xl text-cream">{q}</span>
                  <span className={`text-terracotta text-2xl font-light shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </Button>
                <div id={`faq-${i}`} hidden={!isOpen} className="pb-6">
                  <p className="text-cream/65 text-[15px] font-light leading-relaxed pr-10">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    bedrooms: "" as "" | "Studio" | "1" | "2" | "3" | "4+",
    propertyType: "" as "" | "Flat" | "House" | "Other",
    alreadyListed: "" as "" | "Yes" | "No",
    listingLinkOrPhone: "",
    notes: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "rate">("idle");

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inputCls =
    "w-full min-w-0 bg-transparent border border-cream/20 text-cream placeholder:text-cream/35 px-4 py-3.5 text-sm font-light focus:outline-none focus:border-cream/50 transition-colors";
  const labelCls = "block text-[10px] tracking-[0.18em] uppercase text-cream/60 font-medium mb-2 text-left";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bedrooms || !form.propertyType || !form.alreadyListed || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(estimateEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          location: form.location,
          bedrooms: form.bedrooms,
          propertyType: form.propertyType,
          alreadyListed: form.alreadyListed,
          listingLinkOrPhone: form.listingLinkOrPhone,
          notes: form.notes,
          website: form.website,
        }),
      });
      if (res.status === 429) {
        setStatus("rate");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="cta" className="bg-near-black py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="label-eyebrow mb-6">Get started</p>
        <h2 className="font-serif text-cream text-4xl md:text-5xl lg:text-[56px] leading-[1.08]">
          Find out what your property <span className="italic">could earn.</span>
        </h2>
        <p className="mt-6 text-cream/65 font-light leading-relaxed">
          A free, no-obligation income estimate for your property, based on comparable York listings.
        </p>

        {status === "success" ? (
          <div className="mt-12 border border-cream/20 p-8 md:p-10 text-cream font-light leading-relaxed">
            <p className="font-serif text-2xl md:text-3xl text-cream">Thanks {form.name.split(" ")[0]} —</p>
            <p className="mt-4 text-cream/75">
              we aim to send your estimate within one working day. Prefer email?{" "}
              <a href="mailto:hello@gableandkey.co.uk" className="text-terracotta hover:brightness-110">
                hello@gableandkey.co.uk
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label className={labelCls} htmlFor="gk-name">Name</label>
              <input id="gk-name" required type="text" value={form.name}
                onChange={(e) => update("name", e.target.value)} className={inputCls} placeholder="Your name" />
            </div>
            <div>
              <label className={labelCls} htmlFor="gk-email">Email</label>
              <input id="gk-email" required type="email" value={form.email}
                onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="your@email.com" />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="gk-loc">Property location</label>
              <input id="gk-loc" required type="text" value={form.location}
                onChange={(e) => update("location", e.target.value)} className={inputCls}
                placeholder="e.g. York city centre, Bishopthorpe Road, YO1..." />
            </div>

            <div>
              <label className={labelCls} htmlFor="gk-bed">Bedrooms</label>
              <select id="gk-bed" required value={form.bedrooms}
                onChange={(e) => update("bedrooms", e.target.value as typeof form.bedrooms)}
                className={inputCls + " appearance-none cursor-pointer"}>
                <option value="" className="bg-near-black">Select…</option>
                {["Studio", "1", "2", "3", "4+"].map((b) => (
                  <option key={b} value={b} className="bg-near-black">{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="gk-type">Property type</label>
              <select id="gk-type" required value={form.propertyType}
                onChange={(e) => update("propertyType", e.target.value as typeof form.propertyType)}
                className={inputCls + " appearance-none cursor-pointer"}>
                <option value="" className="bg-near-black">Select…</option>
                {["Flat", "House", "Other"].map((b) => (
                  <option key={b} value={b} className="bg-near-black">{b}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="gk-listed">Is your property already listed on Airbnb?</label>
              <select id="gk-listed" required value={form.alreadyListed}
                onChange={(e) => update("alreadyListed", e.target.value as typeof form.alreadyListed)}
                className={inputCls + " cursor-pointer"}>
                <option value="" className="bg-near-black">Select…</option>
                <option value="Yes" className="bg-near-black">Yes</option>
                <option value="No" className="bg-near-black">No</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="gk-link">Airbnb listing link or phone number <span className="normal-case">(optional)</span></label>
              <input id="gk-link" type="text" maxLength={500} value={form.listingLinkOrPhone}
                onChange={(e) => update("listingLinkOrPhone", e.target.value)} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="gk-notes">Anything else?</label>
              <textarea id="gk-notes" rows={3} value={form.notes}
                onChange={(e) => update("notes", e.target.value)} className={inputCls + " resize-none"}
                placeholder="e.g. currently on Airbnb, empty between tenancies, just curious..." />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <Button
                type="submit"
                disabled={status === "sending"}
                className="h-auto rounded-none shadow-none bg-terracotta text-off-white text-[11px] tracking-[0.18em] uppercase font-medium px-8 py-4 hover:brightness-110 transition-all disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Get my free estimate"}
              </Button>
              {status === "error" && (
                <p className="text-xs text-cream/70 font-light">
                  Something went wrong. Email{" "}
                  <a href="mailto:hello@gableandkey.co.uk" className="text-terracotta">hello@gableandkey.co.uk</a>.
                </p>
              )}
              {status === "rate" && (
                <p className="text-xs text-cream/70 font-light">
                  Too many submissions — try again later or email{" "}
                  <a href="mailto:hello@gableandkey.co.uk" className="text-terracotta">hello@gableandkey.co.uk</a>.
                </p>
              )}
            </div>
            <p className="md:col-span-2 text-xs text-cream/60 leading-relaxed">By sending this you agree to our <a href="/privacy" className="text-terracotta underline">Privacy Policy</a></p>
          </form>
        )}

        <p className="mt-6 text-xs text-cream/45 font-light">
          Prefer email? <a href="mailto:hello@gableandkey.co.uk" className="text-terracotta">hello@gableandkey.co.uk</a>. We aim to reply within one working day.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-near-black border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-[13px] text-cream/55 font-light">
        <a href="#top" className="font-serif text-cream text-lg tracking-normal">Gable & Key</a>
        <nav className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-cream transition-colors">Privacy</a>
          <span className="text-cream/20">·</span>
          <a href="/terms" className="hover:text-cream transition-colors">Terms</a>
          <span className="text-cream/20">·</span>
          <a href="#cta" className="hover:text-cream transition-colors">Contact</a>
        </nav>
        <a href="mailto:hello@gableandkey.co.uk" className="hover:text-cream transition-colors">hello@gableandkey.co.uk</a>
        <div>© 2026 Gable & Key</div>
      </div>
    </footer>
  );
}
