import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Event",
  description: "Book your tickets for an upcoming event quickly and securely.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
