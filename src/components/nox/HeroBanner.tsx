import heroBanner from "@/assets/nox-home-banner.png.asset.json";

export function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border shadow-card">
      <img
        src={heroBanner.url}
        alt="NOX Casino — A noite é sua no NOX"
        width={1536}
        height={768}
        className="block h-auto w-full object-contain"
      />
    </section>
  );
}
