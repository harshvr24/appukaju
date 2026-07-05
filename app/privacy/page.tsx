import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { brand } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Appu Kaju collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy, plainly."
      updated="July 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you place an order we collect your name, delivery address, phone number and email — the minimum needed to pack a box and get it to your door.",
            "If you write to us or call, we keep the conversation history so you never have to repeat yourself. Payment details are handled by our payment providers and never stored on our servers.",
          ],
        },
        {
          heading: "What we do with it",
          body: [
            "We use your details to fulfil orders, send dispatch and delivery updates, and answer your questions. If you opt in, we occasionally write about new batches and festival packs — a few emails a year, not a daily drumbeat.",
            "We never sell, rent or trade your personal information. Ever. That is the whole section.",
          ],
        },
        {
          heading: "Cookies & analytics",
          body: [
            "The site uses essential cookies for your cart and preferences, and privacy-respecting analytics to understand which pages help people. No cross-site advertising trackers.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            `You can ask us to show, correct or delete the information we hold about you at any time. Write to ${brand.email} or call ${brand.phone} — a family member handles these requests personally, usually the same day.`,
          ],
        },
        {
          heading: "Retention & security",
          body: [
            "Order records are kept as long as tax law requires, then deleted. Access to customer information is limited to the family members and staff who need it to serve you.",
          ],
        },
      ]}
    />
  );
}
