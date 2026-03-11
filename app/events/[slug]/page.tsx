import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/api";
import EventPageClient from "./_components/EventPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: "Event Not Found" };
    
    // Strip HTML tags from description if it contains HTML (optional but safe)
    const cleanDescription = event.description 
      ? event.description.replace(/<[^>]*>?/gm, '').substring(0, 160)
      : `Join us for ${event.title}`;

    return { 
      title: event.title, 
      description: cleanDescription 
    };
  } catch {
    return { title: "Event" };
  }
}

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
