import { categories } from "@/lib/games";

export function CategoryChips() {
  return (
    <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <span aria-hidden>{c.icon}</span>
          {c.label}
        </a>
      ))}
    </div>
  );
}
