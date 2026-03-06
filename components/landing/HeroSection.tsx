"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";
import { TubesBackground } from "@/components/ui/TubesBackground";

export function HeroSection() {
  return (
    <div className="relative h-screen sm:h-[80vh] w-full overflow-hidden pointer-events-auto">
      <TubesBackground className="h-full w-full">
        {/* Content */}
        <div className="flex items-center justify-center h-full w-full">
          <div className="relative z-10 w-full max-w-4xl px-6 text-center pointer-events-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6"
            >
              LIVE & <br />
              <span className="text-primary">ENERGETIC</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
            >
              Discover the most anticipated concerts, parties, and events in
              your city. Experience the vibe before you buy.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="pointer-events-auto relative max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center shadow-2xl"
            >
              <div className="flex-1 flex items-center px-4 border-r border-white/10">
                <Search className="w-5 h-5 text-neutral-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search events, artists..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-neutral-500"
                />
              </div>

              <div className="hidden md:flex items-center px-4 border-r border-white/10">
                <MapPin className="w-4 h-4 text-neutral-400 mr-2" />
                <select className="bg-transparent border-none outline-none text-white text-sm cursor-pointer transition-colors">
                  <option className="bg-neutral-900">Lagos</option>
                  <option className="bg-neutral-900">Abuja</option>
                  <option className="bg-neutral-900">London</option>
                </select>
              </div>

              <div className="hidden md:flex items-center px-4">
                <Calendar className="w-4 h-4 text-neutral-400 mr-2" />
                <span className="text-white text-sm cursor-pointer transition-colors">
                  Any Date
                </span>
              </div>

              <button className="bg-primary hover:bg-orange-600 text-white rounded-full p-3 px-6 font-bold transition-all shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)]">
                Search
              </button>
            </motion.div>

            {/* Trending Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm pointer-events-auto"
            >
              <span className="text-neutral-400 mr-2">Trending:</span>

              {[
                "AfroVibes 2026",
                "Davido Live",
                "Tech Fest",
                "Comedy Night",
              ].map((tag, i) => (
                <button
                  key={i}
                  className="px-4 py-1.5 
                  rounded-full 
                  bg-white/10 
                  border border-white/10
                  text-white/80
                  backdrop-blur-md
                  hover:bg-primary
                  hover:text-white
                  hover:border-primary
                  transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(255,77,0,0.35)]
                  cursor-pointer
                  "
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </TubesBackground>
    </div>
  );
}
