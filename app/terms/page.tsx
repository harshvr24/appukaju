import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { brand } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern orders and use of appukaju.com.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms, without the fog."
      updated="July 2026"
      sections={[
        {
          heading: "Who we are",
          body: [
            `${brand.legalName}, a family-run dry fruit factory and shop operating from ${brand.city}, ${brand.state}, India since ${brand.foundedYear}. These terms cover orders placed on appukaju.com.`,
          ],
        },
        {
          heading: "Orders & pricing",
          body: [
            "All prices are in Indian Rupees and include applicable taxes. An order is confirmed when you receive our confirmation message; we may decline or refund orders where stock or freshness cannot be guaranteed.",
            "Because we pack fresh to order, occasional festival-season delays are possible — we will always tell you before you have to ask.",
          ],
        },
        {
          heading: "Shipping",
          body: [
            "Orders dispatch from Lucknow within 24 hours on working days. Delivery estimates (2–4 days to metros) are estimates, not promises — couriers have moods. Risk passes to you on delivery.",
          ],
        },
        {
          heading: "The replacement promise",
          body: [
            "If anything is wrong with your order — quality, damage, wrong item — tell us within 7 days and we replace or refund it. No questions, no return-shipping drama. This promise is the reason we still exist.",
          ],
        },
        {
          heading: "Food information",
          body: [
            "Our products are tree nuts and dried fruits, processed in a facility that handles multiple nut varieties. If you have allergies, please read pack labels and consult your doctor. Nutrition figures are typical values per 100 g.",
          ],
        },
        {
          heading: "Everything else",
          body: [
            "Content on this site belongs to us; please don't reuse it commercially without asking. Disputes are subject to the courts of Lucknow, Uttar Pradesh. For anything unclear, call us — it's faster than a lawyer.",
          ],
        },
      ]}
    />
  );
}
