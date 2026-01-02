'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  IndianRupee,
  BarChart3,
  FileText,
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

/* ================= COMPONENT ================= */

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [medium, setMedium] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');

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

          {/* ================= NOTES ================= */}
          {activeTab === 'notes' && (
            <>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText /> Study Notes
              </h2>

              {/* FILTERS */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <select
                  value={medium}
                  onChange={e => setMedium(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                >
                  <option value="">Select Medium</option>
                  <option value="Hindi">Hindi Medium</option>
                  <option value="English">English Medium</option>
                </select>

                <select
                  value={classNum}
                  onChange={e => setClassNum(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                >
                  <option value="">Select Class</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>

                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                >
                  <option value="">Select Subject</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Maths">Maths</option>
                </select>
              </div>

              {loadingNotes && (
                <p className="text-center">Loading notes...</p>
              )}

              {!loadingNotes && notes.length === 0 && (
                <p className="text-center text-gray-500">
                  No notes found
                </p>
              )}

              <div className="space-y-4">
                {notes.map((n, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
                  >
                    <div>
                      <p className="font-bold text-lg">
                        {n.chapter_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {n.subject} • Class {n.class} • {n.medium}
                      </p>
                    </div>

                    <a
                      href={n.pdf_url}
                      target="_blank"
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition"
                    >
                      Open PDF
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= FEES ================= */}
          {activeTab === 'fees' && (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Total Fees Submitted
                  </h2>
                  {loadingFees ? (
                    <p>Loading...</p>
                  ) : (
                    <p className="text-5xl font-extrabold">
                      ₹ {totalFees}
                    </p>
                  )}
                </div>
              </div>

              {!loadingFees && (
                <div className="max-w-xl mx-auto">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Month Wise Breakdown
                  </h3>
                  {monthlyFees.map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-white p-4 rounded-xl shadow mb-2"
                    >
                      <span>
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

          {/* ================= PERFORMANCE ================= */}
          {activeTab === 'performance' && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Performance Overview
              </h2>

              {loadingPerformance && <p>Loading...</p>}

              {!loadingPerformance && performance.length === 0 && (
                <p>No performance data</p>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {performance.map((p, i) => {
                  const percent = Math.round(
                    (p.marks / p.max_marks) * 100
                  );
                  return (
                    <div
                      key={i}
                      className="border rounded-2xl p-6 shadow"
                    >
                      <h3 className="font-bold mb-2">
                        {p.test_name}
                      </h3>
                      <p>{p.marks} / {p.max_marks}</p>
                      <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-2">{percent}%</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= TAB ================= */

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
