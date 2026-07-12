import {
  Brain,
  Dumbbell,
  Eye,
  HeartPulse,
  Leaf,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/protein/i, Dumbbell],
  [/heart|cholesterol|fats/i, HeartPulse],
  [/energy|instant|booster/i, Zap],
  [/brain|memory|cognit/i, Brain],
  [/eye|vision/i, Eye],
  [/vitamin|antioxidant/i, Sparkles],
  [/iron|bone|calcium/i, Shield],
];

/** Maps a benefit title to a small themed icon. */
export function BenefitIcon({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const Icon = RULES.find(([re]) => re.test(title))?.[1] ?? Leaf;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
