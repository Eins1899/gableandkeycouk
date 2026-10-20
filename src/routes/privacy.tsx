import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Policy | Gable & Key" },
    { name: "description", content: "How Gable & Key collects, uses and protects estimate enquiries, and your UK GDPR rights." },
    { property: "og:title", content: "Privacy Policy | Gable & Key" },
    { property: "og:description", content: "How we handle your estimate enquiry and protect your personal information." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacy,
});

function Privacy() {
  return <LegalPage title="Privacy Policy">
    <section><h2>Who we are</h2><p>Gable &amp; Key is a York-based Airbnb co-hosting service and is responsible for the personal information you send us. Contact us at <a href="mailto:hello@gableandkey.co.uk">hello@gableandkey.co.uk</a>.</p></section>
    <section><h2>What we collect</h2><p>Our estimate form collects your name, email, property location, number of bedrooms, property type, and whether it is already listed on Airbnb. You may also provide an Airbnb listing link or phone number and a message. We record the submission time, a hashed IP address and browser information to help protect the form against spam.</p></section>
    <section><h2>Why we use it</h2><p>We use this information to reply with an indicative income estimate, discuss our service and protect against misuse. Our legal bases under UK GDPR are our legitimate interests in responding to enquiries and protecting the form, and taking steps at your request before entering a contract.</p></section>
    <section><h2>Storage and sharing</h2><p>Enquiries are stored in a secure database, with access restricted to those who need it. Email notifications are sent through Resend. These providers process information to deliver storage and email services on our behalf. Where information is processed outside the UK, appropriate UK GDPR safeguards are required. We do not sell your data or use your enquiry to send unrelated marketing.</p></section>
    <section><h2>How long we keep it</h2><p>We delete enquiries after 12 months if no agreement is made. If we enter an agreement, we explain the retention arrangements for service and contract records separately.</p></section>
    <section><h2>Your rights</h2><p>You can ask to access, correct or delete your personal information, restrict its use, or object to processing based on legitimate interests. You may also have a right to data portability where applicable. To exercise your rights, email <a href="mailto:hello@gableandkey.co.uk">hello@gableandkey.co.uk</a>. You can complain to the Information Commissioner’s Office at <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>.</p></section>
  </LegalPage>;
}