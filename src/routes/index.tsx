import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroYork from "@/assets/hero-york.jpg";
import aboutInterior from "@/assets/about-interior.jpg";
import gableKeyIcon from "@/assets/gable-key-icon.png.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
});

const services = [
  ["01", "Listing optimisation", "Professional descriptions and photography that fill calendars."],
  ["02", "Dynamic pricing", "Smart rates tuned to York events and real-time demand."],
  ["03", "Guest communications", "Every message handled promptly and professionally."],
  ["04", "Check-in coordination", "Seamless self check-in every time."],
  ["05", "Calendar management", "No gaps, no double bookings — always optimised."],
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
      <Testimonial />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Gable & Key home">
          <img src={gableKeyIcon.url} alt="" className="h-11 md:h-12 w-auto object-contain" />
          <span className="font-serif text-cream text-[20px] leading-none tracking-tight">Gable &amp; Key</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[13px] text-cream/80 font-light">
          <a href="#services" className="hover:text-cream transition-colors">Services</a>
          <a href="#how" className="hover:text-cream transition-colors">How it works</a>
          <a href="#about" className="hover:text-cream transition-colors">About</a>
        </nav>
        <a
          href="#cta"
          className="text-[10px] tracking-[0.18em] uppercase font-medium border border-cream/30 text-cream px-4 py-2.5 hover:border-cream hover:bg-cream/5 transition-colors"
        >
          Book a call
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
        alt="York at dusk"
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
          We run your Airbnb from listing to checkout — so you earn more while doing less.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="bg-terracotta text-off-white text-[11px] tracking-[0.18em] uppercase font-medium px-8 py-4 hover:brightness-110 transition-all"
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
    ["Zero", "Upfront cost"],
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
            alt="Boutique interior"
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
            York is one of the UK's most visited cities — but great properties underperform every day due to poor management. Gable & Key exists to close that gap. We're a focused, local co-hosting service that treats every property with the attention it deserves.
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
            Up and running <span className="italic">in days.</span>
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

function Testimonial() {
  return (
    <section className="bg-near-black py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="font-serif text-terracotta/40 text-[140px] md:text-[180px] leading-none select-none">&ldquo;</div>
        <blockquote className="-mt-8 md:-mt-14 font-serif italic text-cream text-2xl md:text-3xl lg:text-[34px] leading-[1.35]">
          Gable & Key took the whole operation off my plate. Occupancy went up, the reviews improved, and I genuinely don&apos;t have to think about it anymore.
        </blockquote>
        <div className="mt-10 mx-auto w-10 h-px bg-terracotta" />
        <p className="mt-6 text-[10px] tracking-[0.22em] uppercase text-cream/60 font-medium">
          James M. · Property Owner, York City Centre
        </p>
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
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-6 md:py-7 flex items-center justify-between gap-6 text-left"
                >
                  <span className="font-serif text-lg md:text-xl text-cream">{q}</span>
                  <span className={`text-terracotta text-2xl font-light shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-6" : "max-h-0"}`}>
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
  const [email, setEmail] = useState("");
  return (
    <section id="cta" className="bg-near-black py-28 md:py-36">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="label-eyebrow mb-6">Get started</p>
        <h2 className="font-serif text-cream text-4xl md:text-5xl lg:text-[56px] leading-[1.08]">
          Find out what your property <span className="italic">could earn.</span>
        </h2>
        <p className="mt-6 text-cream/65 font-light leading-relaxed">
          Free, no-obligation income estimate based on real York market data.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-cream/20 text-cream placeholder:text-cream/35 px-5 py-4 text-sm font-light focus:outline-none focus:border-cream/50 transition-colors"
          />
          <button
            type="submit"
            className="bg-terracotta text-off-white text-[11px] tracking-[0.18em] uppercase font-medium px-8 py-4 hover:brightness-110 transition-all whitespace-nowrap"
          >
            Get Estimate
          </button>
        </form>
        <p className="mt-6 text-xs text-cream/45 font-light">
          Or prefer to talk? We typically respond within a few hours.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-near-black border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-cream/55 font-light">
        <a href="#top" className="font-serif text-cream text-lg tracking-tight">Gable & Key</a>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-cream transition-colors">Privacy</a>
          <span className="text-cream/20">·</span>
          <a href="#" className="hover:text-cream transition-colors">Terms</a>
          <span className="text-cream/20">·</span>
          <a href="#cta" className="hover:text-cream transition-colors">Contact</a>
        </nav>
        <div>© 2026 Gable & Key</div>
      </div>
    </footer>
  );
}
