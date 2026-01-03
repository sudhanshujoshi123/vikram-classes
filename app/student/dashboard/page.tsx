'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  IndianRupee,
  BarChart3,
  FileText,
  X,
} from 'lucide-react';

/* ================= TYPES ================= */

type TabType = 'notes' | 'fees' | 'performance';

interface Note {
  medium: string;
  class: string;
  subject: string;
  chapter_name: string;
  pdf_url: string;
}

interface MonthlyFee {
  month: string;
  amount: number;
}

interface Performance {
  test_name: string;
  marks: number;
  max_marks: number;
  remarks: string;
}

/* ================= COMPONENT ================= */

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  /* NOTES */
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [medium, setMedium] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');
  const [openPdf, setOpenPdf] = useState<string | null>(null);

  /* FEES */
  const [totalFees, setTotalFees] = useState(0);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(true);

  /* PERFORMANCE */
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  const [studentName, setStudentName] = useState('Student');

  /* ================= STUDENT NAME ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setStudentName(payload.name || 'Student');
    } catch {}
  }, []);

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    if (!medium || !classNum || !subject) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(
          `/api/student/notes?medium=${medium}&class=${classNum}&subject=${subject}`
        );
        const data = await res.json();
        setNotes(data.notes || []);
      } catch {
        setNotes([]);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNotes();
  }, [medium, classNum, subject]);

  /* ================= FETCH FEES ================= */
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/fees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTotalFees(data.total_fees || 0);
        setMonthlyFees(data.monthly_fees || []);
      } catch {}
      finally {
        setLoadingFees(false);
      }
    };
    fetchFees();
  }, []);

  /* ================= FETCH PERFORMANCE ================= */
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/performance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPerformance(data.performance || []);
      } catch {}
      finally {
        setLoadingPerformance(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Welcome, {studentName} 👋
        </h1>
        <p className="opacity-90 mt-1">
          Vikram Classes • Student Dashboard
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ================= TABS ================= */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <Tab icon={<BookOpen size={18} />} label="Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
          <Tab icon={<IndianRupee size={18} />} label="Fees" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
          <Tab icon={<BarChart3 size={18} />} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
        </div>

        {/* ================= CONTENT CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8">

          {/* ================= NOTES ================= */}
          {activeTab === 'notes' && (
            <>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <FileText className="text-indigo-600" /> Study Notes
              </h2>

              {/* FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Select value={medium} onChange={setMedium} label="Medium" options={['Hindi', 'English']} />
                <Select value={classNum} onChange={setClassNum} label="Class" options={['11', '12']} />
                <Select value={subject} onChange={setSubject} label="Subject" options={['Physics', 'Chemistry', 'Maths']} />
              </div>

              {loadingNotes && <p className="text-center text-gray-500">Loading notes...</p>}
              {!loadingNotes && notes.length === 0 && <p className="text-center text-gray-400">No notes found</p>}

              <div className="grid gap-4">
                {notes.map((n, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-bold text-indigo-800">{n.chapter_name}</p>
                      <p className="text-xs text-gray-600">
                        {n.subject} • Class {n.class} • {n.medium}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpenPdf(n.pdf_url)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                      Open PDF
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= FEES ================= */}
          {activeTab === 'fees' && (
            <>
              <h2 className="text-xl font-bold mb-5">Fees Summary</h2>

              {loadingFees ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 text-center mb-6 shadow-lg">
                    <p className="text-sm opacity-90">Total Fees Paid</p>
                    <p className="text-4xl font-extrabold mt-2">₹ {totalFees}</p>
                  </div>

                  <div className="space-y-3">
                    {monthlyFees.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-50 rounded-xl p-4 shadow-sm"
                      >
                        <span className="font-medium">{f.month}</span>
                        <span className="font-bold text-green-600">₹ {f.amount}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ================= PERFORMANCE ================= */}
          {activeTab === 'performance' && (
            <>
              <h2 className="text-xl font-bold mb-5">Performance Overview</h2>

              {loadingPerformance && <p>Loading...</p>}

              <div className="grid md:grid-cols-2 gap-4">
                {performance.map((p, i) => {
                  const percent = Math.round((p.marks / p.max_marks) * 100);
                  return (
                    <div
                      key={i}
                      className="border rounded-xl p-4 shadow-sm bg-white"
                    >
                      <p className="font-bold">{p.test_name}</p>
                      <p className="text-sm text-gray-600">
                        {p.marks} / {p.max_marks}
                      </p>

                      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p className="text-xs mt-1 text-gray-500">
                        {percent}% • {p.remarks}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= PDF MODAL ================= */}
      {openPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex">
          <div className="bg-white w-full h-full relative">
            <button
              onClick={() => setOpenPdf(null)}
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full z-10"
            >
              <X size={18} />
            </button>

            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(openPdf)}&embedded=true`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow transition
      ${active
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
        : 'bg-white text-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Select({ value, onChange, label, options }: any) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded-xl px-4 py-3 bg-white shadow-sm"
    >
      <option value="">Select {label}</option>
      {options.map((o: string) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
