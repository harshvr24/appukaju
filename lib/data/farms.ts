import type { Farm } from "@/types";

/**
 * Coordinates are % positions on the stylised India map SVG (viewBox 0 0 100 118).
 */
export const farms: Farm[] = [
  {
    id: "konkan",
    region: "Konkan Coast",
    state: "Maharashtra & Goa",
    crop: "Cashew",
    description:
      "Laterite-soil orchards a sea breeze away from the Arabian coast. The salt air and long dry summers give Konkan kaju its famous sweetness. Our graders visit at harvest and buy at the drying yard, not the mandi.",
    harvest: "March – May",
    coordinates: { x: 28, y: 68 },
  },
  {
    id: "kashmir-badam",
    region: "Kashmir Valley",
    state: "Jammu & Kashmir",
    crop: "Almond & Walnut",
    altitude: "1,600 m",
    description:
      "Family orchards around Pulwama and Anantnag, where almonds ripen slowly in mountain light and walnuts are still cracked by hand on river stones. We take the first-fortnight harvest before the passes close.",
    harvest: "September – October",
    coordinates: { x: 33, y: 12 },
  },
  {
    id: "sangli",
    region: "Sangli & Nashik",
    state: "Maharashtra",
    crop: "Raisin",
    description:
      "The grape belt of the Deccan. Thompson seedless grapes are dried in shade on rope racks — never in direct sun — turned by hand each morning for three weeks until they turn golden-green and honeyed.",
    harvest: "February – April",
    coordinates: { x: 33, y: 62 },
  },
  {
    id: "kutch",
    region: "Kutch",
    state: "Gujarat",
    crop: "Dates",
    description:
      "Oasis orchards on the edge of the Rann, where date palms drink brackish groundwater and answer with impossibly sweet fruit. We take a week-one allocation of the soft harvest every summer.",
    harvest: "June – July",
    coordinates: { x: 18, y: 48 },
  },
  {
    id: "lucknow",
    region: "Our Factory",
    state: "Lucknow, Uttar Pradesh",
    crop: "Roasting · Grading · Packing",
    description:
      "Where it all comes together since 1998. Small-batch roasting twice a week, hand-grading under daylight lamps, and sealed food-grade packing dispatched within 24 hours of your order.",
    harvest: "Fresh batches, all year",
    coordinates: { x: 50, y: 38 },
  },
];
