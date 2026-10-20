import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Website Terms | Gable & Key" },
    { name: "description", content: "Gable & Key website terms for indicative Airbnb income estimates and co-hosting services in York." },
    { property: "og:title", content: "Website Terms | Gable & Key" },
    { property: "og:description", content: "Estimates are indicative only. Co-hosting services require a signed agreement." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Terms,
});

function Terms() {
  return <LegalPage title="Website Terms">
    <section><h2>Information and estimates</h2><p>This website gives general information and indicative income estimates only, not guaranteed earnings. Estimates depend on the property, season and demand. Actual income may differ.</p></section>
    <section><h2>Our services</h2><p>Services are provided only under a signed co-hosting agreement. Fee terms and the responsibilities of each party are set in that agreement.</p></section>
    <section><h2>Contact</h2><p>For questions, email <a href="mailto:hello@gableandkey.co.uk">hello@gableandkey.co.uk</a>.</p></section>
    <section><h2>Governing law</h2><p>These terms are governed by the laws of England and Wales.</p></section>
  </LegalPage>;
}