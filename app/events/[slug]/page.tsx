import { notFound } from "next/navigation";
import EventBookingFlow from "./_components/EventBookingFlow";
import { Calendar, MapPin } from "lucide-react";
import { getEventBySlug } from "@/lib/api";

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

  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        {event.banner_image_url ? (
          <div className="absolute inset-0">
            <img
              src={`${event.banner_image_url}`}
              alt={event.title}
              className="w-full h-full object-cover object-top opacity-60"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <div className="aspect-4/5 w-52 h-auto mb-4 shadow-md rounded-lg hover:animate-borderFill cursor-pointer overflow-hidden ml-4">
            <img
              src={`${event.banner_image_url}`}
              alt={event.title}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            {event.title}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-white/90 text-lg">
            {event.start_time && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{formattedDate}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-350 px-4 md:px-6 py-12 grid md:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 pb-2">About this Event</h2>
            <div
              className="text-white/70 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: event.description || "No description provided.",
              }}
            />
          </div>
        </div>

        {/* Right Column: Booking Flow */}
        <div className="md:col-span-1 relative">
          <div className="sticky top-8">
            <EventBookingFlow event={event} />
          </div>
        </div>
      </main>
    </div>
  );
}
