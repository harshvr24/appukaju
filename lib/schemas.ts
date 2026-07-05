import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please tell us your name"),
  email: z.string().email("That email doesn't look right"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  address: z.string().min(8, "Please enter your full street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code is 6 digits"),
  delivery: z.enum(["standard", "express"]),
  giftNote: z.string().max(240, "Keep the note under 240 characters").optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name"),
  email: z.string().email("That email doesn't look right"),
  phone: z.string().optional(),
  subject: z.string().min(3, "A short subject helps us route it"),
  message: z.string().min(10, "Tell us a little more"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const wholesaleSchema = z.object({
  business: z.string().min(2, "Business name is required"),
  contactName: z.string().min(2, "Contact person is required"),
  email: z.string().email("That email doesn't look right"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  city: z.string().min(2, "City is required"),
  monthlyVolume: z.enum(["10-25", "25-100", "100-500", "500+"]),
  message: z.string().optional(),
});

export type WholesaleInput = z.infer<typeof wholesaleSchema>;
