import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Manage your funds, view payout history, and check your balances.",
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
