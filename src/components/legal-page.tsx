import type { ReactNode } from "react";
import gableKeyIcon from "@/assets/gable-key-icon.png";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-espresso text-cream font-sans">
      <header className="border-b border-cream/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <img src={gableKeyIcon} alt="Gable & Key house-and-key emblem" className="h-11 w-auto" />
            <span className="font-serif text-xl">Gable &amp; Key</span>
          </a>
          <a href="/#cta" className="text-sm text-cream/70 hover:text-cream">Free Estimate</a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">{title}</h1>
        <div className="space-y-10 text-cream/70 font-light leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-cream [&_h2]:mb-3 [&_a]:text-terracotta [&_a]:underline [&_a]:break-words">{children}</div>
      </main>
      <footer className="border-t border-cream/10 bg-near-black px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-wrap justify-between gap-6 text-sm text-cream/60">
          <a href="/" className="font-serif text-lg text-cream">Gable &amp; Key</a>
          <nav className="flex flex-wrap gap-6"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/#cta">Contact</a></nav>
          <a href="mailto:hello@gableandkey.co.uk">hello@gableandkey.co.uk</a>
          <p>© 2026 Gable &amp; Key</p>
        </div>
      </footer>
    </div>
  );
}