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

export default function EventStatsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
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

            const [eventRes, statsRes] = await Promise.all([
                fetch(`http://localhost:8000/api/v1/events/${eventId}`, { headers }),
                fetch(`http://localhost:8000/api/v1/events/${eventId}/stats`, { headers })
            ]);

            if (eventRes.ok && statsRes.ok) {
                setEvent(await eventRes.json());
                setStats(await statsRes.json());
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
                          <p className="text-2xl font-bold">${(stats.total_revenue / 100).toFixed(2)}</p>
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
