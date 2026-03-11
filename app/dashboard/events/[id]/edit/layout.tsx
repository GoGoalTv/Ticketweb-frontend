import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Modify the details, tickets, and settings for your event.",
};

export default function EditEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
