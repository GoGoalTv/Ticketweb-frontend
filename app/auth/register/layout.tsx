import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new GoGoalTv Ticketing account.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
