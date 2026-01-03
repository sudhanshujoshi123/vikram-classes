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
  status: string;
}

interface Performance {
  test_name: string;
  subject: string;
  marks: number;
  max_marks: number;
  remarks: string;
}

/* ================= COMPONENT ================= */

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  /* ===== NOTES ===== */
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [medium, setMedium] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');
  const [openPdf, setOpenPdf] = useState<string | null>(null);

  /* ===== FEES ===== */
  const [totalFees, setTotalFees] = useState<number>(0);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(true);

  /* ===== PERFORMANCE ===== */
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
      try {
        setLoadingNotes(true);
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
      } catch {
        setMonthlyFees([]);
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
        setPerformance([]);
      } finally {
        setLoadingPerformance(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-10 shadow-xl">
        <h1 className="text-4xl font-extrabold">
          Welcome, {studentName} 👋
        </h1>
        <p className="opacity-90 mt-1 text-lg">
          Student Dashboard
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= TABS ================= */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Tab icon={<BookOpen size={18} />} label="Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
          <Tab icon={<IndianRupee size={18} />} label="Fees" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
          <Tab icon={<BarChart3 size={18} />} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

          {/* ================= NOTES ================= */}
          {activeTab === 'notes' && (
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText /> Study Notes
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <select value={medium} onChange={e => setMedium(e.target.value)} className="border rounded-xl px-4 py-3">
                  <option value="">Medium</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>

                <select value={classNum} onChange={e => setClassNum(e.target.value)} className="border rounded-xl px-4 py-3">
                  <option value="">Class</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>

                <select value={subject} onChange={e => setSubject(e.target.value)} className="border rounded-xl px-4 py-3">
                  <option value="">Subject</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Maths">Maths</option>
                </select>
              </div>

              {loadingNotes && <p className="text-center">Loading notes...</p>}
              {!loadingNotes && notes.length === 0 && (
                <p className="text-center text-gray-500">No notes found</p>
              )}

              <div className="space-y-4">
                {notes.map((n, i) => (
                  <div key={i} className="flex justify-between items-center bg-white rounded-xl p-5 shadow">
                    <div>
                      <p className="font-bold">{n.chapter_name}</p>
                      <p className="text-sm text-gray-600">
                        {n.subject} • Class {n.class} • {n.medium}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpenPdf(n.pdf_url)}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
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
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <IndianRupee /> Fees Details
              </h2>

              {loadingFees && <p>Loading fees...</p>}

              {!loadingFees && (
                <>
                  <div className="mb-6 text-xl font-semibold">
                    Total Fees Paid: ₹{totalFees}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border rounded-xl overflow-hidden">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="p-3">Month</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyFees.map((f, i) => (
                          <tr key={i} className="border-t text-center">
                            <td className="p-3">{f.month}</td>
                            <td className="p-3">₹{f.amount}</td>
                            <td className={`p-3 font-semibold ${f.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                              {f.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

          {/* ================= PERFORMANCE ================= */}
          {activeTab === 'performance' && (
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 /> Performance
              </h2>

              {loadingPerformance && <p>Loading performance...</p>}

              {!loadingPerformance && performance.length === 0 && (
                <p className="text-gray-500">No performance data</p>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {performance.map((p, i) => (
                  <div key={i} className="bg-white shadow rounded-xl p-5">
                    <h3 className="font-bold text-lg">{p.test_name}</h3>
                    <p className="text-sm text-gray-600">{p.subject}</p>
                    <p className="mt-2 font-semibold">
                      Marks: {p.marks} / {p.max_marks}
                    </p>
                    <p className="text-sm mt-1 text-indigo-600">{p.remarks}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= PDF MODAL ================= */}
      {openPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden relative">
            <button
              onClick={() => setOpenPdf(null)}
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full"
            >
              <X />
            </button>

            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(openPdf)}&embedded=true`}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TAB COMPONENT ================= */

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
