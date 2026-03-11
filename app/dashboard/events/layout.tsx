import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events",
  description: "Manage your created events, track ticket sales, and view analytics.",
};

export default function DashboardEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
