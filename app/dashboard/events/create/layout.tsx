import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Host a new event with our easy-to-use event creation tools.",
};

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
