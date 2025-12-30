'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  IndianRupee,
  BarChart3,
  FileText,
} from 'lucide-react';

type TabType = 'notes' | 'fees' | 'performance';

interface Note {
  class: string;
  subject: string;
  book_name: string;
  chapter_name: string;
  pdf_url: string;
}

interface Performance {
  test_name: string;
  marks: number;
  max_marks: number;
  remarks: string;
}

interface MonthlyFee {
  month: string;
  amount: number;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [studentName, setStudentName] = useState('Student');

  const [totalFees, setTotalFees] = useState<number>(0);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(true);

  const [performance, setPerformance] = useState<Performance[]>([]);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

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
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotes(data.notes || []);
      } catch {
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchNotes();
  }, []);

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
      } catch {
      } finally {
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
      } catch {
      } finally {
        setLoadingPerformance(false);
      }
    };
    fetchPerformance();
  }, []);

  const class11 = notes.filter(n => n.class === '11');
  const class12 = notes.filter(n => n.class === '12');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-10 shadow-xl">
        <h1 className="text-4xl font-extrabold">
          Welcome, {studentName} 👋
        </h1>
        <p className="opacity-90 mt-1 text-lg">
          Vikram Classes • Student Dashboard
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= TABS ================= */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Tab
            icon={<BookOpen size={18} />}
            label="Notes"
            active={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
          />
          <Tab
            icon={<IndianRupee size={18} />}
            label="Fees"
            active={activeTab === 'fees'}
            onClick={() => setActiveTab('fees')}
          />
          <Tab
            icon={<BarChart3 size={18} />}
            label="Performance"
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

          {/* ===== NOTES ===== */}
          {activeTab === 'notes' && (
            <>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <FileText /> Chemistry Notes
              </h2>

              {loadingNotes && <p className="text-center">Loading notes...</p>}

              {!loadingNotes && notes.length === 0 && (
                <p className="text-center text-red-500">No notes uploaded yet</p>
              )}

              <div className="grid lg:grid-cols-2 gap-10">
                <ClassPanel title="Class 11" notes={class11} />
                <ClassPanel title="Class 12" notes={class12} />
              </div>
            </>
          )}

          {/* ===== FEES (MONTH WISE) ===== */}
          {activeTab === 'fees' && (
            <div className="space-y-8">

              {/* TOTAL FEES */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Total Fees Submitted
                  </h2>

                  {loadingFees ? (
                    <p className="animate-pulse text-lg">Loading...</p>
                  ) : (
                    <p className="text-5xl font-extrabold">
                      ₹ {totalFees}
                    </p>
                  )}

                  <p className="mt-3 opacity-90">
                    Till date submitted fees
                  </p>
                </div>
              </div>

              {/* MONTHLY FEES */}
              {!loadingFees && (
                <div className="max-w-xl mx-auto">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Month Wise Breakdown
                  </h3>

                  {monthlyFees.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No monthly fee records found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {monthlyFees.map((f, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
                        >
                          <span className="font-semibold">
                            {new Date(f.month + '-01').toLocaleString('en-IN', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="font-bold text-green-600">
                            ₹ {f.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===== PERFORMANCE ===== */}
          {activeTab === 'performance' && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Performance Overview
              </h2>

              {loadingPerformance && <p>Loading performance...</p>}

              {!loadingPerformance && performance.length === 0 && (
                <p className="text-red-500">No performance records found</p>
              )}

              {!loadingPerformance && performance.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {performance.map((p, i) => {
                    const percent = Math.round(
                      (p.marks / p.max_marks) * 100
                    );

                    return (
                      <div
                        key={i}
                        className="border rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
                      >
                        <h3 className="font-bold text-lg mb-2">
                          {p.test_name}
                        </h3>

                        <p className="text-sm mb-2">
                          Marks: <strong>{p.marks}</strong> / {p.max_marks}
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className="h-3 rounded-full bg-indigo-600"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <p className="text-sm font-semibold">
                          Percentage: {percent}%
                        </p>

                        <p className="text-xs text-gray-600 mt-2">
                          {p.remarks}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow transition
        ${active
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
          : 'bg-white hover:bg-indigo-50'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ClassPanel({ title, notes }: any) {
  return (
    <div className="border rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 text-xl font-bold">
        {title}
      </div>

      {notes.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No notes available</p>
      ) : (
        notes.map((n: Note, i: number) => (
          <div
            key={i}
            className="p-6 border-t flex justify-between items-center hover:bg-indigo-50 transition"
          >
            <div>
              <p className="font-bold">{n.book_name}</p>
              <p className="text-sm text-gray-600">
                {n.subject} • {n.chapter_name}
              </p>
            </div>
            <a
              href={n.pdf_url}
              target="_blank"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Open PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
}
