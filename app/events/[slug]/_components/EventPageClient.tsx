"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Info } from "lucide-react";
import { PublicEvent } from "@/lib/api";
import EventDetails from "./EventDetails";
import EventBookingFlow from "./EventBookingFlow";

export default function EventPageClient({
  event,
  formattedDate,
}: {
  event: PublicEvent;
  formattedDate: any;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen pb-20 font-sans">

      {/* ── Collapsible Hero — stays in page flow, never fixed ── */}
      <section className="relative w-full">
        <motion.div
          animate={{ height: isCollapsed ? "0px" : "60vh" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full overflow-hidden bg-gray-900 shadow-2xl relative"
        >
          {/* Full background image — expanded state */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img
                  src={event.banner_image_url}
                  alt={event.title}
                  className="w-full h-full object-cover object-top opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solid fill — collapsed state */}
          {isCollapsed && (
            <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10" />
          )}

          {/* Hero overlay content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-8">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6">

              {/* Thumbnail image */}
              <motion.div
                animate={{
                  width: isCollapsed ? "120px" : "200px",
                  height: isCollapsed ? "auto" : "250px",
                  marginBottom: isCollapsed ? "0px" : "20px",
                }}
                className="hidden aspect-4/5 md:block shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <img
                  src={event.banner_image_url}
                  alt={event.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </motion.div>

              {/* Title + metadata */}
              <motion.div className="flex-1 space-y-3">
                <motion.h1
                  animate={{
                    fontSize: isCollapsed ? "20px" : "48px",
                    lineHeight: isCollapsed ? "28px" : "56px",
                  }}
                  className="font-black text-white tracking-tight drop-shadow-2xl max-w-3xl"
                >
                  {event.title}
                </motion.h1>

                <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-white/70 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className={isCollapsed ? "text-xs" : "text-lg"}>
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className={isCollapsed ? "text-xs" : "text-lg"}>
                      {event.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Content — rearranges into two columns on collapse ── */}
      <main className="max-w-[1320px] mx-auto px-6 py-12 lg:py-20">
        <div
          className={`transition-all duration-700 ${
            isCollapsed
              ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
              : "flex flex-col items-center"
          }`}
        >
          {/* Event Details — sticky on the left when collapsed */}
          <div
            className={`transition-all duration-700 ${
              isCollapsed
                ? "lg:col-span-7 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto"
                : "w-full lg:max-w-4xl"
            }`}
          >
            <EventDetails event={event} formattedDate={formattedDate} isCollapsed={isCollapsed} />
          </div>

          {/* Booking Flow — scrollable on the right when collapsed */}
          <div
            className={`transition-all duration-700 ${
              isCollapsed
                ? "lg:col-span-5"
                : "w-full lg:max-w-4xl mt-16"
            }`}
          >
            <div className="p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="mb-8">
                <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  Secure Booking
                </h2>
              </div>
              <EventBookingFlow event={event} />
            </div>

            {/* Trust signal */}
            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
              <div className="h-[1px] flex-1 bg-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                Verified Experience
              </span>
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
