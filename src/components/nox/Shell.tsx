import type { ReactNode } from "react";

import { BottomNavigation } from "./BottomNavigation";
import { DepositModal } from "./DepositModal";
import { DepositRequiredModal } from "./DepositRequiredModal";
import { Header } from "./Header";
import { RegisterModal } from "./RegisterModal";
import { WithdrawModal } from "./WithdrawModal";

export function Shell({ children, beforeHeader }: { children: ReactNode; beforeHeader?: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {beforeHeader}
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-4">{children}</main>
      <BottomNavigation />
      <RegisterModal />
      <DepositModal />
      <WithdrawModal />
      <DepositRequiredModal />
    </div>
  );
}
