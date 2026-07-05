export const brand = {
  name: "Appu Kaju",
  legalName: "Appu Kaju Wala",
  tagline: "Best quality, for a healthy life",
  foundedYear: 1998,
  city: "Lucknow",
  state: "Uttar Pradesh",
  phone: "+91 96162 24108",
  phoneHref: "tel:+919616224108",
  whatsappHref: "https://wa.me/919616224108",
  email: "appukajuwala@gmail.com",
  emailHref: "mailto:appukajuwala@gmail.com",
  url: "https://appukaju.com",
  freeShippingThreshold: 999,
} as const;

export const yearsOfCraft = new Date().getFullYear() - brand.foundedYear;

export const stats = [
  { value: yearsOfCraft, suffix: "+", label: "Years of craft" },
  { value: 50000, suffix: "+", label: "Families served" },
  { value: 40, suffix: " kg", label: "Max batch size" },
  { value: 24, suffix: " hrs", label: "Order to dispatch" },
] as const;

export const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/our-farms", label: "Farms" },
  { href: "/recipes", label: "Recipes" },
  { href: "/corporate-gifting", label: "Gifting" },
] as const;

export const fullNav = [
  {
    heading: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products?category=cashew", label: "Cashews" },
      { href: "/products?category=mix", label: "Premium Mix" },
      { href: "/corporate-gifting", label: "Corporate Gifting" },
      { href: "/wholesale", label: "Wholesale" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/our-farms", label: "Our Farms" },
      { href: "/quality-process", label: "Quality Process" },
      { href: "/health-benefits", label: "Health Benefits" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    heading: "Kitchen",
    links: [
      { href: "/recipes", label: "Recipes" },
      { href: "/blogs", label: "Journal" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/account", label: "Account" },
    ],
  },
] as const;
