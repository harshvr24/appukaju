import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-body font-medium transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-(--ease-out-expo) disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        gold: "bg-terracotta text-parchment shadow-soft hover:bg-terracotta-deep",
        dark: "bg-forest text-parchment hover:bg-forest-deep",
        cream: "bg-parchment text-forest hover:bg-cream",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
