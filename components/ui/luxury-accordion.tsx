"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionEntry {
  id: string;
  question: string;
  answer: string;
  meta?: string;
}

interface LuxuryAccordionProps {
  items: AccordionEntry[];
  className?: string;
}

/** Gold-hairline accordion with a rotating plus and smooth height. */
export function LuxuryAccordion({ items, className }: LuxuryAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn("divide-y divide-chocolate/10", className)}
    >
      {items.map((item, i) => (
        <Accordion.Item key={item.id} value={item.id} className="group">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full cursor-pointer items-baseline gap-5 py-7 text-left transition-colors duration-300 hover:text-walnut md:gap-8">
              <span className="font-body text-xs text-terracotta tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-display text-lg font-medium tracking-tight text-chocolate md:text-2xl">
                {item.question}
              </span>
              {item.meta && (
                <span className="eyebrow hidden text-chocolate/40 md:block">
                  {item.meta}
                </span>
              )}
              <span className="grid size-9 shrink-0 translate-y-1.5 place-items-center rounded-full border border-chocolate/15 transition-all duration-500 ease-(--ease-out-expo) group-data-[state=open]:rotate-45 group-data-[state=open]:border-terracotta group-data-[state=open]:bg-terracotta group-data-[state=open]:text-parchment">
                <Plus className="size-4" strokeWidth={1.75} />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.35s_var(--ease-out-expo)] data-[state=open]:animate-[accordion-down_0.45s_var(--ease-out-expo)]">
            <p className="max-w-3xl pb-8 pl-9 text-base leading-relaxed text-chocolate/70 md:pl-14">
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
