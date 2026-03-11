"use client";

import React, { useState, useEffect } from "react";
import { BookingCanvas } from "./_components/BookingCanvas";
import { BookingSummary } from "./_components/BookingSummary";
import { getPublicEvents, createReservation, checkoutOrder} from "@/lib/api";
import { Event, TicketTier } from "@/lib/schema/eventTied";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      try {
        // For demo, we fetch the first available event
        // In production, this would use a slug param
        const events = await getPublicEvents();
        if (events.length > 0) {
          setEvent(events[0]);
        }
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, []);

  const handleSeatSelect = (seat: any) => {
    setSelectedSeats((prev) => {
      if (prev.find((s) => s.id === seat.id)) {
         return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const handleCheckout = async () => {
    if (!event || !event.ticket_tiers) return;

    // Map seats to tiers
    // Simplification: "vip" seats -> VIP Tier, others -> GA Tier
    const vipTier = event.ticket_tiers.find(t => t.type === "ASSIGNED_SEATING") || event.ticket_tiers[0];
    const gaTier = event.ticket_tiers.find(t => t.type === "GENERAL_ADMISSION") || event.ticket_tiers[0];

    // Group selected seats by type
    const vipCount = selectedSeats.filter(s => s.status === "vip").length;
    const gaCount = selectedSeats.filter(s => s.status !== "vip").length;

    const items = [];
    if (vipCount > 0 && vipTier) {
      items.push({ tier_id: vipTier.id, quantity: vipCount });
    }
    if (gaCount > 0 && gaTier) {
      items.push({ tier_id: gaTier.id, quantity: gaCount });
    }

    if (items.length === 0) return;

    try {
      // 1. Hold Tickets
      const reservation = await createReservation(event.id, items);

      // 2. Checkout (Initialize Paystack)
      // Mock guest data for now, would typically come from a form or auth context
      const guestEmail = `guest_${Date.now()}@example.com`;
      const guestName = "Guest User";
      
      // const order = await checkoutOrder(reservation.reservation_id, guestEmail, guestName);

      // 3. Redirect to Payment
      // if (order.authorization_url) {
      //   window.location.href = order.authorization_url;
      // }
    } catch (error) {
       console.error("Checkout failed", error);
       alert("Checkout failed. Please try again.");
    }
  };

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading Setup...</div>;
  if (!event) return <div className="h-screen bg-black text-white flex items-center justify-center">No Event Found</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden">
      {/* Left: Canvas */}
      <div className="flex-1 h-full p-4 lg:p-6 relative">
         {/* Event Title Overlay */}
         <div className="absolute top-6 left-8 z-20 pointer-events-none">
            <h1 className="text-2xl font-bold text-white mb-1">{event.title}</h1>
            <p className="text-white/60 text-sm">{event.location} • {new Date(event.start_time).toLocaleDateString()}</p>
         </div>

         <BookingCanvas 
            onSeatSelect={handleSeatSelect} 
            selectedSeats={selectedSeats.map(s => s.id)} 
         />
      </div>

      {/* Right: Summary */}
      <div className="h-auto lg:h-full shrink-0">
         <BookingSummary 
            selectedSeats={selectedSeats}
            totalPrice={totalPrice} 
            onCheckout={handleCheckout}
         />
      </div>
    </div>
  );
}
