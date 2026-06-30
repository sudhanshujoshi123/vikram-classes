'use client';

import { useState, useEffect } from 'react';

interface Payment {
  id: number;
  student_id: number;
  student_name: string;
  email: string;
  class_name: string;
  utr_number: string;
  amount: number;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify-payment');
      const data = await res.json();
      
      if (data.success) {
        setPayments(data.payments);
      } else {
        alert('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (paymentId: number, studentId: number, className: string, action: 'verify' | 'reject') => {
    if (action === 'verify') {
      if (!confirm('Are you sure you want to verify this payment and activate subscription?')) return;
    } else {
      if (!confirm('Are you sure you want to reject this payment?')) return;
    }

    setProcessingId(paymentId);

    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, studentId, className, action }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Payment ${action === 'verify' ? 'verified' : 'rejected'} successfully!`);
        fetchPayments(); // Refresh list
      } else {
        alert(data.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Something went wrong');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading pending payments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Verifications
          </h1>
          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
        
        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No pending payments 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div 
                key={payment.id} 
                className="bg-white rounded-lg shadow p-6 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Student Name</p>
                    <p className="font-semibold text-gray-900">{payment.student_name}</p>
                    <p className="text-sm text-gray-600">{payment.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Class</p>
                    <p className="font-semibold text-gray-900">{payment.class_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Amount</p>
                    <p className="font-semibold text-green-600 text-lg">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">UTR Number</p>
                    <p className="font-mono font-semibold text-gray-900">{payment.utr_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAction(payment.id, payment.student_id, payment.class_name, 'verify')}
                    disabled={processingId === payment.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {processingId === payment.id ? 'Processing...' : '✓ Verify & Activate'}
                  </button>
                  <button
                    onClick={() => handleAction(payment.id, payment.student_id, payment.class_name, 'reject')}
                    disabled={processingId === payment.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                  >
                    {processingId === payment.id ? 'Processing...' : '✗ Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}