import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AmbientParticles } from "@/components/shared/ambient-particles";

export default function NotFound() {
  return (
    <div className="noise relative grid min-h-screen place-items-center overflow-hidden bg-cocoa px-5 text-center text-cream">
      <AmbientParticles count={16} />
      <div className="relative">
        {/* Floating cashew crescent */}
        <div className="animate-float mx-auto mb-10 w-28" aria-hidden>
          <svg viewBox="0 0 100 100" className="w-full drop-shadow-[0_0_24px_rgb(212_175_55_/_0.3)]">
            <path
              d="M 25 60 A 32 32 0 1 1 75 60 A 26 26 0 1 0 25 60 Z"
              fill="#e9d9b8"
              transform="rotate(-25 50 50)"
            />
          </svg>
        </div>
        <p className="eyebrow text-gold">Error 404</p>
        <h1 className="text-display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]">
          This shelf is empty.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-cream/60">
          The page you&apos;re after has been eaten, moved, or never existed.
          The fresh batches, however, are exactly where they should be.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">Back to the story</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-cream">
            <Link href="/products">Browse the collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
