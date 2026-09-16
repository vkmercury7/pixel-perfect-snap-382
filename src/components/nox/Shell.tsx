import type { ReactNode } from "react";

import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";
import { RegisterModal } from "./RegisterModal";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-4">{children}</main>
      <BottomNavigation />
      <RegisterModal />
    </div>
  );
}
