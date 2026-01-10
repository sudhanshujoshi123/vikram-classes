'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import {
  BookOpen,
  IndianRupee,
  BarChart3,
  FileText,
  X,
} from 'lucide-react';

/* ================= TYPES ================= */
type TabType = 'notes' | 'pyq' | 'practical' | 'fees' | 'performance';

interface Note {
  medium: string;
  class: string;
  subject: string;
  chapter_name: string;
  pdf_url: string;
}
interface PYQ {
  pdf_url: string;
}

interface Practical {
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

  const [notes, setNotes] = useState<Note[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
const [loadingPyq, setLoadingPyq] = useState(false);

const [pyqMedium, setPyqMedium] = useState('');
const [pyqClass, setPyqClass] = useState('');
const [pyqSubject, setPyqSubject] = useState('');

const [practicals, setPracticals] = useState<any[]>([]);
const [loadingPractical, setLoadingPractical] = useState(false);

const [practicalMedium, setPracticalMedium] = useState('');
const [practicalClass, setPracticalClass] = useState('');
const [practicalSubject, setPracticalSubject] = useState('');



  const [medium, setMedium] = useState('');
  const [search, setSearch] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');
  const [openPdf, setOpenPdf] = useState<string | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingFees, setLoadingFees] = useState<boolean>(true);

  const [totalFees, setTotalFees] = useState(0);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);

  const [performance, setPerformance] = useState<Performance[]>([]);
  const [studentName, setStudentName] = useState('Student');

  /* ================= AUTH ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setStudentName(payload.name || 'Student');
    } catch {}
  }, []);

  /* ================= NOTES ================= */
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
  /* ================= PYQ ================= */
useEffect(() => {
  if (activeTab !== 'pyq') return;

  if (!pyqMedium || !pyqClass || !pyqSubject) {
    setPyqs([]);
    return;
  }

  const fetchPyq = async () => {
    setLoadingPyq(true);
    try {
      const res = await fetch(
        `/api/student/pyq?medium=${pyqMedium}&class=${pyqClass}&subject=${pyqSubject}`
      );
      const data = await res.json();
      setPyqs(data.pyq || []);
    } catch {
      setPyqs([]);
    } finally {
      setLoadingPyq(false);
    }
  };

  fetchPyq();
}, [activeTab, pyqMedium, pyqClass, pyqSubject]);


/* ================= PRACTICAL ================= */
useEffect(() => {
  if (activeTab !== 'practical') return;

  if (!practicalMedium || !practicalClass || !practicalSubject) {
    setPracticals([]);
    return;
  }

  const fetchPracticals = async () => {
    setLoadingPractical(true);
    try {
      const res = await fetch(
        `/api/student/practical?medium=${practicalMedium}&class=${practicalClass}&subject=${practicalSubject}`
      );
      const data = await res.json();
      setPracticals(data.practicals || []);
    } catch {
      setPracticals([]);
    } finally {
      setLoadingPractical(false);
    }
  };

  fetchPracticals();
}, [activeTab, practicalMedium, practicalClass, practicalSubject]);

  /* ================= FEES ================= */
  useEffect(() => {
  const fetchFees = async () => {
    setLoadingFees(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/student/fees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setTotalFees(data?.total_fees ?? 0);
      setMonthlyFees(data?.monthly_fees ?? []);
    } catch (err) {
      console.error('Fees fetch error', err);
      setTotalFees(0);
      setMonthlyFees([]);
    } finally {
      setLoadingFees(false);
    }
  };

  fetchFees();
}, []);

  /* ================= PERFORMANCE ================= */
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
    };
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-8 shadow-xl">
       <h1 className="text-2xl md:text-3xl font-extrabold">
  Hello {studentName} 👋
</h1>
<p className="opacity-90 mt-1 text-sm md:text-base">
  Welcome to your learning dashboard at Vikram Classes
</p>

      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* TABS */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <Tab icon={<BookOpen size={18} />} label="Study Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
          <Tab icon={<FileText size={18} />} label="PYQ" active={activeTab === 'pyq'} onClick={() => setActiveTab('pyq')} />
          <Tab icon={<FileText size={18} />} label="Practical" active={activeTab === 'practical'} onClick={() => setActiveTab('practical')} />
          <Tab icon={<IndianRupee size={18} />} label="Fees & Payments" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
          <Tab icon={<BarChart3 size={18} />} label="Acadmic Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
        </div>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 md:p-8">

          {/* ================= NOTES ================= */}
          {activeTab === 'notes' && (
  <>
    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 className="text-xl font-extrabold flex items-center gap-2">
       📘 Your Study Materials
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search chapter..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-xl px-4 py-2 w-full md:w-64 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
      />
    </div>

    {/* FILTERS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <FilterSelect value={medium} onChange={setMedium} label="Medium" options={['Hindi', 'English']} />
      <FilterSelect value={classNum} onChange={setClassNum} label="Class" options={['11', '12']} />
      <FilterSelect value={subject} onChange={setSubject} label="Subject" options={['Physics', 'Chemistry', 'Maths']} />
    </div>

    {/* STATES */}
    {loadingNotes && (
      <p className="text-center text-gray-500 animate-pulse">
        Loading notes...
      </p>
    )}

    {!loadingNotes && notes.length === 0 && (
      <p className="text-center text-gray-400">
        No notes found 📭  
Please select Medium, Class & Subject to view notes.

      </p>
    )}

    {/* NOTES GRID */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes
        .filter(n =>
          n.chapter_name.toLowerCase().includes(search.toLowerCase())
        )
        .map((n, i) => (
          <div
            key={i}
            className="group bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col h-full justify-between">

              {/* TOP */}
              <div>
                <p className="text-sm text-indigo-600 font-semibold">
                  {n.subject} • Class {n.class}
                </p>

                <h3 className="font-extrabold text-lg text-gray-800 mt-2">
                  {n.chapter_name}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Medium: {n.medium}
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => setOpenPdf(n.pdf_url)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:scale-[1.02] transition"
              >
                📄 Open PDF Notes
              </button>
            </div>
          </div>
        ))}
    </div>
  </>
)}
{activeTab === 'pyq' && (
  <>
    <h2 className="text-xl font-extrabold mb-6">
      📚 Previous Year Question Papers
    </h2>

    {/* FILTERS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <FilterSelect label="Medium" value={pyqMedium} onChange={setPyqMedium} options={['Hindi', 'English']} />
      <FilterSelect label="Class" value={pyqClass} onChange={setPyqClass} options={['11', '12']} />
      <FilterSelect label="Subject" value={pyqSubject} onChange={setPyqSubject} options={['Chemistry', 'Physics', 'Biology']} />
    </div>

    {loadingPyq && (
      <p className="text-center text-gray-500">Loading PYQ...</p>
    )}

    {!loadingPyq && pyqs.length === 0 && (
      <p className="text-center text-gray-400">
        No PYQ found 📭
      </p>
    )}

    <div className="grid md:grid-cols-2 gap-5">
      {pyqs.map((p, i) => (
        <div key={i} className="bg-indigo-50 border rounded-2xl p-5">
          <p className="font-bold mb-4">
            {p.subject} • Class {p.class}
          </p>

          <button
            onClick={() => setOpenPdf(p.pdf_url)}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl"
          >
            📄 Open PYQ PDF
          </button>
        </div>
      ))}
    </div>
  </>
)}


{activeTab === 'practical' && (
  <>
    <h2 className="text-xl font-extrabold mb-6">
      🧪 Practical PDFs
    </h2>

    {/* FILTERS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <FilterSelect
        label="Medium"
        value={practicalMedium}
        onChange={setPracticalMedium}
        options={['Hindi', 'English']}
      />
      <FilterSelect
        label="Class"
        value={practicalClass}
        onChange={setPracticalClass}
        options={['11', '12']}
      />
      <FilterSelect
        label="Subject"
        value={practicalSubject}
        onChange={setPracticalSubject}
        options={['Physics', 'Chemistry', 'Biology']}
      />
    </div>

    {loadingPractical && (
      <p className="text-center text-gray-500">
        Loading practicals...
      </p>
    )}

    {!loadingPractical && practicals.length === 0 && (
      <p className="text-center text-gray-400">
        No practical found 📭
      </p>
    )}

    <div className="grid md:grid-cols-2 gap-5">
      {practicals.map((p, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 border rounded-2xl p-5 shadow-sm"
        >
          <p className="font-bold mb-4">
            {p.subject} • Class {p.class}
          </p>

          <button
            onClick={() => setOpenPdf(p.pdf_url)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl"
          >
            📄 Open Practical PDF
          </button>
        </div>
      ))}
    </div>
  </>
)}



          {/* ================= FEES ================= */}
         {activeTab === 'fees' && (
  <>
    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-extrabold flex items-center gap-2">
        💰 Your Fee Details
      </h2>
    </div>

    {loadingFees ? (
      <p className="text-center text-gray-500 animate-pulse">
        Loading fees details...
      </p>
    ) : (
      <>
        {/* TOTAL FEES CARD */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20 text-[120px]">
            ₹
          </div>

          <p className="text-sm opacity-90">Total Fees Paid Till Date</p>
          <p className="text-4xl md:text-5xl font-extrabold mt-2">
            ₹ {totalFees}
          </p>

          <p className="text-xs mt-2 opacity-80">
            Auto-updated from institute records
          </p>
        </div>

        {/* MONTHLY FEES */}
        <h3 className="font-bold text-lg mb-4">
         Monthly Fee Payment
        </h3>

        <div className="space-y-4">
          {monthlyFees.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-700 w-12 h-12 flex items-center justify-center rounded-xl font-bold">
                  ₹
                </div>

                <div>
                  <p className="font-bold text-gray-800">
                    {f.month}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fees Paid
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="font-extrabold text-green-600 text-lg">
                  ₹ {f.amount}
                </p>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Paid
                </span>
              </div>
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
              <h2 className="text-xl font-bold mb-6">📊 Academic Performance Report</h2>

              <div className="grid md:grid-cols-2 gap-5">
                {performance.map((p, i) => {
                  const percent = Math.round((p.marks / p.max_marks) * 100);
                  return (
                    <div
                      key={i}
                      className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md"
                    >
                      <p className="font-bold">{p.test_name}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Score: {p.marks} / {p.max_marks}
                      </p>

                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p className="text-xs mt-2 text-gray-500">
                        Performance: {percent}% • Teacher Remark: {p.remarks}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PDF MODAL */}
      {openPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex">
          <div className="bg-white w-full h-full relative">
            <button
              onClick={() => setOpenPdf(null)}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
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

/* ================= UI PARTS ================= */
function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition shadow
      ${active
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
        : 'bg-white text-gray-700 hover:bg-indigo-50'
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
function FilterSelect({ value, onChange, label, options }: any) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border-0 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
      >
        <option value="">Select {label}</option>
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

