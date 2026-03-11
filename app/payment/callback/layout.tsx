import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processing Payment",
  description: "Please wait while we process your payment safely and securely.",
};

export default function PaymentCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
