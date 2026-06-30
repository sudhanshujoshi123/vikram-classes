'use client';

import { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';

export default function PaymentModal({ 
  studentId, 
  className, 
  chapterId,
  chapterName,
  onSuccess, 
  onClose 
}: any) {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          className,
          chapterId,
          utrNumber,
          amount: 3,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Payment submitted successfully!\n\nChapter: ${chapterName}\nAmount: ₹3\nValidity: 3 months\n\nAdmin will verify within 24 hours.`);
        onSuccess();
      } else {
        setError(data.error || 'Failed to submit payment');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Access Chapter - ₹3</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Chapter Info */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Chapter</p>
          <p className="text-white font-bold text-lg">{chapterName}</p>
          <p className="text-xs text-gray-400 mt-2">Class {className}</p>
        </div>

        {/* Payment Details */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="text-emerald-400" size={20} />
            <p className="text-sm text-emerald-300 font-semibold">Pay ₹3 via UPI</p>
          </div>
          <div className="bg-white rounded-lg p-3 mb-2">
            <p className="text-center text-xs text-gray-600 mb-1">UPI ID</p>
            <p className="text-center font-bold text-gray-900 text-lg">
              {process.env.NEXT_PUBLIC_ADMIN_UPI_ID || 'vikramclasses@ybl'}
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Name: {process.env.NEXT_PUBLIC_ADMIN_UPI_NAME || 'Vikram Classes'}
          </p>
        </div>

        {/* Validity Info */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm text-amber-300 font-semibold">Validity: 3 Months</p>
              <p className="text-xs text-amber-200/70 mt-1">
                After payment verification, you will get access to <strong>this specific chapter</strong> for 3 months.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              UTR / Transaction ID *
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g., UTR1234567890"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Find UTR in your payment receipt (Google Pay/PhonePe/Paytm)
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !utrNumber}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold transition"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>
        </form>

        {/* Steps */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 font-semibold mb-3">How to pay:</p>
          <ol className="text-xs text-gray-400 space-y-2">
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">1.</span>
              <span>Open Google Pay / PhonePe / Paytm</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">2.</span>
              <span>Send ₹3 to above UPI ID</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">3.</span>
              <span>Copy UTR from payment receipt</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">4.</span>
              <span>Paste UTR above and submit</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}