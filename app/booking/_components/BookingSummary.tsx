"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Ticket, Check, ChevronRight } from "lucide-react";

interface BookingSummaryProps {
  selectedSeats: any[];
  totalPrice: number;
  onCheckout?: () => void;
}

export const BookingSummary = ({ selectedSeats, totalPrice, onCheckout }: BookingSummaryProps) => {
  return (
    <div className="w-full lg:w-96 bg-[#121212] border-l border-white/5 p-6 flex flex-col h-full relative">
       {/* Header */}
       <div className="p-6 border-b border-white/5 bg-white/5">
         <h2 className="text-2xl font-bold text-white">
           Booking Summary
         </h2>
         <div className="flex items-center gap-2 text-primary mt-2 text-sm font-medium">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>09:59 remaining</span>
         </div>
       </div>

       {/* Selected Items */}
       <div className="flex-1 overflow-y-auto space-y-4 pr-2">
         <AnimatePresence>
            {selectedSeats.length === 0 && (
                <div className="text-center py-10 text-neutral-600 border border-dashed border-neutral-800 rounded-2xl">
                    <Ticket className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Select seats to proceed</p>
                </div>
            )}
            
            {selectedSeats.map((seat) => (
                <motion.div
                   key={seat.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-mono text-neutral-400">
                           {seat.row}-{seat.col}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">General Admission</p>
                            <p className="text-xs text-neutral-500">Row {seat.row + 1}</p>
                        </div>
                    </div>
                    <span className="text-white font-mono">${seat.price}</span>
                </motion.div>
            ))}
         </AnimatePresence>
       </div>

       {/* Total & Action */}
       <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
          <div className="flex justify-between items-end">
              <span className="text-neutral-400 text-sm">Total</span>
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                  ${totalPrice}
              </span>
          </div>
          
          <button 
             onClick={onCheckout}
             disabled={selectedSeats.length === 0}
             className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)] hover:shadow-[0_0_50px_rgba(255,77,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
             <span>Confirm Booking</span>
             <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center text-[10px] text-neutral-600">
             Powered by <span className="text-neutral-500 font-bold">Fakson Pay</span>
          </p>
       </div>
    </div>
  );
};
