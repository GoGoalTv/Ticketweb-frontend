'use client';
import { useState } from 'react';
import { checkoutOrder, ReservationResponse } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { redirectTo } from './utils';

export default function CheckoutForm({
  reservation,
  onSuccess,
  onCancel,
}: {
  reservation: ReservationResponse;
  onSuccess: (order: any) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await checkoutOrder(reservation.reservation_id, {
        name,
        email,
        paymentToken: 'paystack'
      });
      
      // Redirect to Paystack
      if (response.authorization_url) {
        redirectTo(response.authorization_url);
      } else {
        setError("Payment initialization failed. No authorization URL returned.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minutesLeft = Math.max(0, Math.floor((new Date(reservation.expires_at).getTime() - Date.now()) / 1000 / 60));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="font-bold text-lg">Checkout</h3>
        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Reserved for {minutesLeft} mins
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
          <input
            id="fullName"
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
          <input
            id="email"
            required
            type="email"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

        <div className="pt-4 border-t flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Due</p>
            <p className="text-2xl font-bold text-gray-900">${(reservation.total_amount / 100).toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
               Pay Here
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
