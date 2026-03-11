"use client";

// @ts-ignore: allow side-effect CSS import without type declarations
import "swiper/css";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronRight } from "lucide-react";
import { EventCard } from "@/components/landing/EventCard";
import { ArrowRight } from "lucide-react";
import { getPublicEvents } from "@/lib/api";
import { Event } from "@/lib/schema/eventTied";

export default function Home() {
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
    <main className="min-h-screen bg-[#0A0A0A]">
      <HeroSection />

      {/* Trending Section */}
      <section className="py-20 relative z-10">
        <div className="sm:flex justify-between items-end mb-10 px-6 md:px-12 lg:px-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Trending Events
            </h2>
            <p className="text-neutral-400">
              Don't miss out on what everyone's talking about.
            </p>
          </div>
          <button className="text-primary hover:text-white transition-colors flex items-center gap-2 font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-white">Loading events...</div>
        ) : (
          <>
            <div className="relative">
              {events.length === 0 ? (
                <p className="text-neutral-500 text-center">No events found.</p>
              ) : (
                <div className="mt-8">
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={"auto"}
                    className="w-full h-[520px] pt-8! px-6 md:px-12 lg:px-20"
                  >
                    {events.slice(0, 10).map((event) => (
                      <SwiperSlide key={event.id} className="!w-70 h-auto">
                        <EventCard
                          slug={event.slug}
                          title={event.title}
                          date={new Date(event.start_time).toLocaleDateString()}
                          image={
                            event.image_url ||
                            "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
                          }
                          price="From ₦20"
                          location={event.location || "TBA"}
                          category="Music"
                          isTrending={true}
                        />
                      </SwiperSlide>
                    ))}

                    {/* See More Slide */}
                    {events.length > 10 && (
                      <SwiperSlide className="w-55!">
                        <a
                          href="/events"
                          className="flex h-full pl-4 items-center justify-start rounded-2xl bg-black transition"
                        >
                          <div className="flex items-center rounded-full bg-primary p-4 gap-2 text-white font-medium hover:animate-shimmer">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </a>
                      </SwiperSlide>
                    )}
                  </Swiper>

                  <div className="pointer-events-none absolute top-0 left-0 h-full w-40 z-20 bg-gradient-to-r from-black via-black/70 to-transparent" />
                  <div className="pointer-events-none absolute top-0 right-0 h-full w-40 z-20 bg-gradient-to-l from-black via-black/70 to-transparent" />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Featured Banner (Placeholder) */}
      <section className="py-10 px-6 md:px-12 lg:px-20">
        <div className="rounded-3xl bg-primary/10 border border-white/5 p-12 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Host Your Own Event
            </h2>
            <p className="text-neutral-300 max-w-xl mx-auto mb-8">
              Create, sell, and manage tickets seamlessly. Join thousands of
              creators using our platform.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-white/5 text-center text-neutral-600 text-sm">
        <p>&copy; 2026 Ticketing Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}
