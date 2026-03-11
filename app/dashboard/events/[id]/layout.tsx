import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details",
  description: "View detailed information and insights about your event.",
};

export default function EventDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
