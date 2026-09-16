import heroBanner from "@/assets/hero-banner.jpg";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/lib/auth-modal";

export function HeroBanner() {
  const { user } = useAuth();
  const { open } = useAuthModal();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border shadow-card">
      <img
        src={heroBanner}
        alt="Mesa de cassino com cartas e fichas douradas"
        width={1600}
        height={912}
        className="h-44 w-full object-cover sm:h-60 lg:h-72"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center gap-2 p-4 sm:gap-3 sm:p-8">
        <span className="w-fit rounded-md bg-primary/15 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-primary">
          Demonstração
        </span>
        <h1 className="max-w-[16ch] text-xl font-extrabold leading-tight text-foreground sm:text-3xl lg:text-4xl">
          A noite é sua no NOX
        </h1>
        <p className="max-w-[34ch] text-xs text-muted-foreground sm:text-sm">
          Mais de 1.000 jogos entre slots e crash, em uma experiência feita para o mobile.
        </p>
        {!user && (
          <button
            type="button"
            onClick={() => open("register")}
            className="mt-1 w-fit rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-opacity hover:opacity-90 sm:text-sm"
          >
            Criar conta
          </button>
        )}
      </div>
    </section>
  );
}
