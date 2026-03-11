import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get answers to your questions and find support for GoGoalTv Ticketing.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
