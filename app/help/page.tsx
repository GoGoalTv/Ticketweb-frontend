"use client";

import { MessageCircle, HelpCircle, Users, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HelpCenter() {
  const sections = [
    {
      title: "How do Table Tickets work?",
      icon: <Users className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70 leading-relaxed">
            What is a <span className="text-white font-bold">'Combined Table Name'</span>? When booking a full table (e.g., a Table of 5), you have the option to select <span className="text-white font-bold">"Use my name for all seats."</span> This is ideal if you haven't finalized your guest list or if you are arriving at the venue together.
          </p>
        </div>
      ),
    },
    {
      title: "How do my guests get in?",
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Arriving Together</h4>
            <p className="text-white/60 text-sm">
              This is the smoothest method. The "Table Primary" (the buyer) presents their master QR code, and the usher checks in the entire "Party of 5" at once.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Arriving Separately</h4>
            <p className="text-white/60 text-sm">
              If your guests arrive before you, they must provide the Buyer’s Full Name and the Table Number listed on the ticket. However, we <span className="text-white font-bold">strictly recommend sharing the PDF ticket</span> with them in advance to avoid delays.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Can I change the names later?",
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      content: (
        <p className="text-white/70 leading-relaxed">
          If the Event Creator has disabled "Combined Names" for your specific tier, you will be required to provide individual names for each seat during checkout to finalize the booking.
        </p>
      ),
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
          <h1 className="text-6xl font-black tracking-tighter">Help <span className="text-primary">Center</span></h1>
          <p className="text-white/40 text-lg max-w-xl">Everything you need to know about table reservations and group bookings.</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="pl-16">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-12 rounded-3xl bg-primary flex flex-col items-center text-center space-y-6">
          <MessageCircle className="w-12 h-12 text-white" />
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white">Still have questions?</h3>
            <p className="text-white/80">Our support team is available 24/7 to help you with your booking.</p>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform uppercase tracking-widest text-xs">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
