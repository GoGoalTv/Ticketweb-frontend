"use client";

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Users, DollarSign, Ticket, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Event {
    id: string;
    title: string;
    slug: string;
    banner_image_url?: string;
}

interface EventStats {
    total_revenue: number;
    tickets_sold: number;
    tickets_available: number;
}

interface Guest {
    id: string;
    attendee_name: string;
    attendee_email: string;
    tier: {
        name: string;
    };
    seat_number?: number;
    table_number?: number;
    shared_attendee: boolean;
    status: string;
    created_at: string;
}

export default function EventStatsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
        router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
        if (!user || !eventId) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [eventRes, statsRes, guestsRes] = await Promise.all([
                fetch(`http://localhost:8000/api/v1/events/${eventId}`, { headers }),
                fetch(`http://localhost:8000/api/v1/events/${eventId}/stats`, { headers }),
                fetch(`http://localhost:8000/api/v1/events/${eventId}/guestlist`, { headers })
            ]);

            if (eventRes.ok && statsRes.ok) {
                setEvent(await eventRes.json());
                setStats(await statsRes.json());
            }
            if (guestsRes.ok) {
                setGuests(await guestsRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch event data", error);
        } finally {
            setLoadingData(false);
        }
    }
    fetchData();
  }, [user, eventId]);

  const copyLink = () => {
      if (!event) return;
      const url = `${window.location.origin}/events/${event.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (loading || loadingData || !eventId) return (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!event || !stats) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex justify-between items-end border-b pb-6">
              <div>
                  <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                  <p className="text-gray-500 mt-1">Event Performance</p>
              </div>
              <Link href={`/events/${event.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Public Page
                  </Button>
              </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full text-green-600">
                          <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="text-2xl font-bold">₦{(stats.total_revenue).toLocaleString()}</p>
                      </div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                          <Users className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Tickets Sold</p>
                          <p className="text-2xl font-bold">{stats.tickets_sold}</p>
                      </div>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                          <Ticket className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Tickets Available</p>
                          <p className="text-2xl font-bold">{stats.tickets_available}</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Guestlist</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{guests.length} Attendees</p>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              <th className="px-6 py-4">Attendee</th>
                              <th className="px-6 py-4">Tier</th>
                              <th className="px-6 py-4">Seat / Table</th>
                              <th className="px-6 py-4">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {guests.length === 0 ? (
                              <tr>
                                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                      No tickets sold yet.
                                  </td>
                              </tr>
                          ) : (
                              guests.map((guest) => (
                                  <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-6 py-4">
                                          <p className="font-bold text-gray-900">{guest.attendee_name || 'N/A'}</p>
                                          <p className="text-xs text-gray-500">{guest.attendee_email}</p>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                                              {guest.tier.name}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4">
                                          {guest.shared_attendee ? (
                                              <span className="text-[10px] font-black px-2 py-1 bg-blue-100 text-blue-600 rounded uppercase tracking-tighter">
                                                  COMBINED — T-{guest.table_number}
                                              </span>
                                          ) : (
                                              <span className="text-sm font-medium text-gray-600">
                                                  {guest.seat_number ? `Seat ${guest.seat_number}` : (guest.table_number ? `Table ${guest.table_number}` : '—')}
                                              </span>
                                          )}
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className="text-[10px] font-black px-2 py-1 bg-green-100 text-green-600 rounded uppercase tracking-widest">
                                              {guest.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Share Your Event</h3>
              <div className="flex gap-4 items-center">
                  <input 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/events/${event.slug}`}
                    className="flex-1 p-3 border rounded-lg bg-gray-50 text-gray-600"
                  />
                  <Button onClick={copyLink} className="min-w-[120px]">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Copy Link"}
                  </Button>
              </div>
              <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out ${event.title}&url=${window.location.origin}/events/${event.slug}`, '_blank')}>
                      Share on Twitter
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/events/${event.slug}`, '_blank')}>
                      Share on Facebook
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/?text=Check out ${event.title} ${window.location.origin}/events/${event.slug}`, '_blank')}>
                      Share on WhatsApp
                  </Button>
              </div>
          </div>
      </div>
    </div>
  );
}
