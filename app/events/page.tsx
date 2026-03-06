"use client";

import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/lib/schema/eventTied";
import { EventCard } from "@/components/landing/EventCard";
import { useEffect, useState } from "react";
import { getPublicEvents } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getPublicEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);
  return (
    <>
      <div className="p-4 px-8">
        <div className="grid grid-cols-6 gap-6">
          {events.map((event) => (
            <EventCard
              slug={event.slug}
              title={event.title}
              date={new Date(event.start_time).toLocaleDateString()}
              image={
                event.banner_image_url ||
                "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
              }
              price="From ₦20"
              location={event.location || "TBA"}
              category="Music"
              isTrending={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}
