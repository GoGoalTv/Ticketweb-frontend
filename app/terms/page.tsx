"use client";

import { Scale, ShieldCheck, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsConditions() {
  const sections = [
    {
      id: "8.1",
      title: "Combined Attribution",
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      text: "By selecting the 'Use my name for all seats' option, the Purchaser acknowledges that they are the sole 'Primary Attributed Guest' for the entire table unit.",
    },
    {
      id: "8.2",
      title: "Entry Requirements",
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      text: "For tickets using a Combined Name, the venue reserves the right to deny entry to any individual who cannot produce a valid digital or physical copy of the ticket or verify the Primary Attributed Guest's identity.",
    },
    {
      id: "8.3",
      title: "Responsibility",
      icon: <AlertCircle className="w-5 h-5 text-primary" />,
      text: "The Purchaser (Buyer) is responsible for the conduct of all individuals seated at their table. All tickets will clearly display 'Purchased by: [Buyer Name]' to maintain a secure chain of custody for the entry assets.",
    },
    {
      id: "8.4",
      title: "No Partial Resale",
      icon: <Scale className="w-5 h-5 text-primary" />,
      text: "Tickets designated under a 'Combined Name' for a table unit cannot be sold individually. The table is treated as a single contractual unit of entry.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter uppercase">Terms & <span className="text-primary">Conditions</span></h1>
          <p className="text-white/40 text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-12">
          <p className="text-white/60 leading-relaxed text-lg">
            Our terms are designed to ensure a safe, fair, and seamless experience for all event attendees. Please review Section 8 specifically for table reservations and group bookings.
          </p>

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight border-b border-white/10 pb-4 uppercase">
              Section 8: Group Bookings and Table Attribution
            </h2>
            
            <div className="grid gap-6">
              {sections.map((section, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-black text-xs">{section.id}</span>
                      <h3 className="font-bold text-white uppercase tracking-wider text-sm">{section.title}</h3>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} TicketWeb Platform. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
