import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/api";
import EventPageClient from "./_components/EventPageClient";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const date = new Date(event.start_time);

  const formattedDate = `${date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })} ${date.getFullYear()}, ${date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  return <EventPageClient event={event} formattedDate={formattedDate} />;
}
