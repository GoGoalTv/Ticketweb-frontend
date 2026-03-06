"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  slug: string;
  title: string;
  date: string;
  image: string;
  price: string;
  location: string;
  category: string;
  className?: string;
  isTrending?: boolean;
}

export function EventCard({
  slug,
  title,
  date,
  location,
  image,
  className,
}: EventCardProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      onClick={() => router.push(`/events/${slug}`)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`group max-w-72 w-full bg-black rounded-2xl hover:border-b hover:border-r hover:border-primary shadow-xl overflow-hidden ${className} cursor-pointer`}
    >
      {/* Animated Border */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent hover:animate-borderFill
        "
      />

      {/* Artwork Section */}
      <div className="relative w-full aspect-4/5 overflow-hidden">
        {/* Skeleton Loader */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        )}

        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          sizes="220px"
          className={`object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => setLoaded(true)}
        />

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%]" />
      </div>

      {/* Metadata Section */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-white text-base font-bold line-clamp-1">{title}</h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          {/* <Calendar className="w-4 h-4 opacity-80" /> */}
          {date}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <MapPin className="w-4 h-4 opacity-70" />
          {location}
        </div>
      </div>
    </motion.div>
  );
}
