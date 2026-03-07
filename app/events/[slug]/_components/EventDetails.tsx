"use client";

import { Info, Share2, Heart, Calendar, MapPin } from "lucide-react";
import { PublicEvent } from "@/lib/api";

interface EventDetailsProps {
  event: PublicEvent;
  formattedDate: string;
  isCollapsed: boolean;
}

export default function EventDetails({ event, formattedDate, isCollapsed }: EventDetailsProps) {
  return (
    <div className="pt-10">
      {/* Event card — image beside title/date/location (collapsed only) */}
      {isCollapsed && (
        <div className="flex flex-col sm:flex-row gap-6 p-5">
          {/* Image */}
          <div className="relative w-full sm:w-48 shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
            <img
              src={event.banner_image_url}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary transition-all active:scale-90">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all active:scale-90">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title + metadata */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h2>
            <div className="flex flex-col gap-3 text-white/60 font-medium text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Section */}
      <div className="p-10 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">About this Event</h2>
        </div>

        <div
          className="text-white/60 text-lg leading-relaxed space-y-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: event.description || "No description provided.",
          }}
        />
      </div>

      {/* Policy info bar */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-dashed border-white/10 text-white/30 italic text-sm">
        <span>Tickets are non-refundable • ID required for entry</span>
        <span className="font-bold uppercase tracking-widest text-[10px]">Premium Experience</span>
      </div>
    </div>
  );
}

