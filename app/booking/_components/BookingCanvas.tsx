"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Mock Seat Data Generator
const generateSeats = (rows: number, cols: number) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const status = Math.random() > 0.8 ? "occupied" : Math.random() > 0.9 ? "vip" : "available";
      seats.push({
        id: `r${r}-c${c}`,
        row: r,
        col: c,
        status,
        price: status === "vip" ? 150 : 50,
      });
    }
  }
  return seats;
};

const SEATS = generateSeats(10, 14);

interface BookingCanvasProps {
  onSeatSelect: (seat: any) => void;
  selectedSeats: string[];
}

export const BookingCanvas = ({ onSeatSelect, selectedSeats }: BookingCanvasProps) => {
  const [scale, setScale] = useState(1);
  
  const handleSeatClick = (seat: any) => {
    if (seat.status === "occupied") return;
    onSeatSelect(seat);
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-[#0A0A0A] rounded-3xl border border-white/5 overflow-hidden relative group">
      {/* Stage Glow effect omitted for plain color theme */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/20 rounded-full" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-mono text-white/30 tracking-widest uppercase">
        Stage
      </div>

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-6 left-6 flex gap-2 z-10">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/10">
          -
        </button>
        <button onClick={() => setScale(s => Math.min(2, s + 0.2))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/10">
          +
        </button>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-full flex items-center justify-center overflow-auto p-20 cursor-grab active:cursor-grabbing">
        <motion.div 
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="grid gap-3"
          style={{ 
            gridTemplateColumns: `repeat(14, minmax(0, 1fr))` 
          }}
        >
          {SEATS.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            const isOccupied = seat.status === "occupied";
            const isVip = seat.status === "vip";

            return (
              <motion.button
                key={seat.id}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSeatClick(seat)}
                className={`
                  w-6 h-6 rounded-t-lg rounded-b-sm border transition-colors duration-300 relative
                  ${isOccupied
                     ? "bg-neutral-800 border-neutral-800 opacity-30 cursor-not-allowed"
                     : isSelected
                       ? "bg-primary border-primary shadow-[0_0_15px_rgba(255,77,0,0.5)]"
                       : seat.status === "booked"
                         ? "bg-neutral-800 border-neutral-700 opacity-50 cursor-not-allowed"
                         : isVip
                         ? "bg-yellow-700 border-yellow-500/50"
                         : "bg-neutral-800 border-neutral-600 hover:border-primary hover:bg-primary/20"
                   }
                `}
              >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 hover:opacity-100 whitespace-nowrap pointer-events-none font-bold z-20">
                     Row {seat.row + 1} • ${seat.price}
                  </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
