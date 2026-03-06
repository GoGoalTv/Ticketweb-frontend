import { motion } from "framer-motion";
import { LucideTicket, Calendar, MapPin } from "lucide-react";

interface TicketProps {
  eventName: string;
  date: string;
  time: string;
  location: string;
  seat: string;
  price: string;
  ticketId: string;
  variant?: "default" | "gold" | "platinum";
}

export function Ticket({ 
  eventName, 
  date, 
  time, 
  location, 
  seat, 
  price, 
  ticketId,
  variant = "default" 
}: TicketProps) {
  
  const getColor = () => {
    switch(variant) {
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-slate-300";
      default: return "bg-primary";
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto group perspective-1000">
      <motion.div 
        initial={{ rotateY: 0 }}
        whileHover={{ rotateY: 5, rotateX: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Top Section - Event Imagery & Info */}
        <div className="relative h-64 p-6 flex flex-col justify-between z-10">
          {/* Background Gradient/Image */}
          <div className={`absolute inset-0 ${getColor()} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          {/* Holographic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

          <div className="flex justify-between items-start">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-xs font-mono tracking-widest text-white/80">
              ADMIT ONE
            </span>
            <LucideTicket className="w-6 h-6 text-white/50" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white/90 leading-tight mb-2 tracking-tighter">
              {eventName}
            </h2>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Tear Line */}
        <div className="relative h-8 bg-[#0A0A0A] flex items-center justify-between">
           <div className="w-4 h-8 bg-[#0A0A0A] rounded-r-full -ml-2 border-r border-white/10"></div>
           <div className="flex-1 h-[1px] border-t-2 border-dashed border-white/10 mx-2"></div>
           <div className="w-4 h-8 bg-[#0A0A0A] rounded-l-full -mr-2 border-l border-white/10"></div>
        </div>

        {/* Bottom Section - Details & QR */}
        <div className="bg-[#0F0F0F] p-6 pt-2 flex justify-between items-end relative z-10">
          <div className="space-y-4">
             <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Date & Time</span>
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{date}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 pl-6">
                  <span className="text-xs text-neutral-400">@</span>
                  <span className="font-semibold">{time}</span>
                </div>
             </div>

             <div className="flex gap-6">
               <div>
                 <span className="text-xs text-neutral-500 uppercase tracking-widest">Seat</span>
                 <p className="text-xl font-mono font-bold text-white">{seat}</p>
               </div>
               <div>
                 <span className="text-xs text-neutral-500 uppercase tracking-widest">Price</span>
                 <p className="text-xl font-mono font-bold text-primary">{price}</p>
               </div>
             </div>
          </div>

          <div className="bg-white p-2 rounded-xl h-24 w-24 flex items-center justify-center shrink-0">
             {/* QR Placeholder */}
             <div className="w-full h-full bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-[10px] font-mono text-center text-neutral-500 break-all px-1">
                  {ticketId.slice(0,8)}...
                </span>
             </div>
          </div>
        </div>
        
        {/* Security / Watermark */}
         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/10 font-mono tracking-[0.5em] pointer-events-none select-none">
            {ticketId}
         </div>
      </motion.div>
    </div>
  );
}
