"use client";

import { forwardRef, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Expanding ripple from the pointer position (skipped for reduced motion). */
function spawnRipple(e: PointerEvent<HTMLElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const d = Math.max(rect.width, rect.height) * 2;
  const span = document.createElement("span");
  span.className = "btn-ripple";
  span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
  target.appendChild(span);
  span.addEventListener("animationend", () => span.remove(), { once: true });
}

const buttonVariants = cva(
  "group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-body font-medium transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-(--ease-out-expo) disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        gold: "bg-terracotta text-parchment shadow-soft hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-lift",
        dark: "bg-forest text-parchment hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift",
        cream: "bg-parchment text-forest hover:-translate-y-0.5 hover:bg-cream hover:shadow-lift",
        outline:
          "border border-current bg-transparent text-current hover:bg-terracotta/10",
        ghost: "bg-transparent text-current hover:bg-forest/5",
      },
      size: {
        sm: "h-10 rounded-full px-5 text-sm",
        md: "h-12 rounded-full px-7 text-sm tracking-wide",
        lg: "h-14 rounded-full px-9 text-base tracking-wide",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onPointerDown, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
          spawnRipple(e);
          onPointerDown?.(e);
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
