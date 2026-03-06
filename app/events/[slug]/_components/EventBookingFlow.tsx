'use client';
import { useState } from 'react';
import { PublicEvent, ReservationResponse, holdTickets, ReservationItem } from '@/lib/api';
import TicketSelection from './TicketSelection';
import CheckoutForm from './CheckoutForm';
import { CheckCircle2, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function EventBookingFlow({ event }: { event: PublicEvent }) {
  const [step, setStep] = useState<'SELECT' | 'CHECKOUT' | 'SUCCESS'>('SELECT');
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHoldTickets = async (items: ReservationItem[]) => {
    try {
      setError(null);
      const res = await holdTickets(event.id, items);
      setReservation(res);
      setStep('CHECKOUT');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to reserve tickets. Please try again.");
    }
  };

  const handleSuccess = (completedOrder: any) => {
    setOrder(completedOrder);
    setStep('SUCCESS');
  };

  if (step === 'SUCCESS' && order) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="text-gray-600 mt-2">Your tickets have been sent to your email.</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-left border">
           <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Order Reference</p>
           <p className="font-mono text-lg font-medium">{order.id}</p>
        </div>

        <div className="pt-4">
            <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Ticket className="w-4 h-4"/>
              View My Tickets (Demo)
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
            {error}
        </div>
      )}
      
      {step === 'SELECT' && (
        <TicketSelection event={event} onCheckout={handleHoldTickets} />
      )}

      {step === 'CHECKOUT' && reservation && (
        <CheckoutForm
            reservation={reservation}
            onSuccess={handleSuccess}
            onCancel={() => setStep('SELECT')} 
        />
      )}
    </div>
  );
}
