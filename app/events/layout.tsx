import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Events",
  description: "Browse and discover exciting events matching your interests.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
