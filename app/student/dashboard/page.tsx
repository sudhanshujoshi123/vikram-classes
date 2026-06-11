'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, IndianRupee, BarChart3, FileText, X,
  LogOut, Bell, Search, ChevronRight, Atom,
  FlaskConical, GraduationCap, Trophy, Star,
  TrendingUp, Zap, Shield, Award, Target,
  Menu, ChevronDown, Flame
} from 'lucide-react';

/* ─── TYPES ─── */
type TabType = 'notes' | 'pyq' | 'practical' | 'fees' | 'performance';

interface Note { medium: string; class: string; subject: string; chapter_name: string; pdf_url: string; }
interface MonthlyFee { month: string; amount: number; }
interface Performance { test_name: string; marks: number; max_marks: number; remarks: string; }

/* ─── BADGE CONFIG ─── */
const BADGES = [
  { id: 'star', icon: <Star size={20} />, label: 'Top Scorer', desc: 'Score 90%+ in any test', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30', unlockAt: (p: Performance[]) => p.some(x => x.marks / x.max_marks >= 0.9) },
  { id: 'flame', icon: <Flame size={20} />, label: 'On Fire', desc: '3 tests above 80%', color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/30', unlockAt: (p: Performance[]) => p.filter(x => x.marks / x.max_marks >= 0.8).length >= 3 },
  { id: 'shield', icon: <Shield size={20} />, label: 'Consistent', desc: 'Never below 60%', color: 'from-cyan-500 to-teal-500', shadow: 'shadow-cyan-500/30', unlockAt: (p: Performance[]) => p.length > 0 && p.every(x => x.marks / x.max_marks >= 0.6) },
  { id: 'target', icon: <Target size={20} />, label: 'Goal Crusher', desc: 'Appeared in 5+ tests', color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/30', unlockAt: (p: Performance[]) => p.length >= 5 },
  { id: 'zap', icon: <Zap size={20} />, label: 'Quick Learner', desc: 'Accessed 10+ notes', color: 'from-indigo-500 to-blue-500', shadow: 'shadow-indigo-500/30', unlockAt: (_: Performance[], noteCount: number) => noteCount >= 10 },
  { id: 'trophy', icon: <Trophy size={20} />, label: 'Champion', desc: 'All badges unlocked', color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/30', unlockAt: () => false },
];

/* ─── MINI SPARKLINE ─── */
function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40, pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke="url(#spark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── CIRCULAR PROGRESS ─── */
function CircleProgress({ percent, size = 64, stroke = 5, color = '#818cf8' }: any) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

/* ─── BAR CHART ─── */
function PerformanceChart({ data }: { data: Performance[] }) {
  if (!data.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <BarChart3 size={48} className="mb-3 opacity-30" />
      <p className="text-sm">No test data yet</p>
    </div>
  );
  const max = Math.max(...data.map(d => d.max_marks));
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end gap-3 min-w-max px-2 pb-2" style={{ height: 180 }}>
        {data.map((d, i) => {
          const pct = (d.marks / d.max_marks) * 100;
          const barH = Math.round((d.marks / max) * 130);
          const color = pct >= 90 ? '#f59e0b' : pct >= 75 ? '#22d3ee' : pct >= 60 ? '#818cf8' : '#f43f5e';
          return (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: barH, opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              className="relative flex flex-col items-center gap-1 group"
              style={{ width: 44 }}
            >
              {/* tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10
                text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                {d.marks}/{d.max_marks} • {Math.round(pct)}%
              </div>
              <div className="w-full rounded-t-lg" style={{ height: barH, background: color, opacity: 0.85 }} />
              <span className="text-[10px] text-gray-500 text-center leading-tight w-full truncate">
                {d.test_name.length > 8 ? d.test_name.slice(0, 7) + '…' : d.test_name}
              </span>
            </motion.div>
          );
        })}
      </div>
      {/* x-axis line */}
      <div className="h-px bg-white/10 mx-2 -mt-1" />
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [practicals, setPracticals] = useState<any[]>([]);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [studentName, setStudentName] = useState('Student');
  const [noteAccessCount, setNoteAccessCount] = useState(0);

  const [medium, setMedium] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [pyqMedium, setPyqMedium] = useState('');
  const [pyqClass, setPyqClass] = useState('');
  const [pyqSubject, setPyqSubject] = useState('');
  const [practicalMedium, setPracticalMedium] = useState('');
  const [practicalClass, setPracticalClass] = useState('');
  const [practicalSubject, setPracticalSubject] = useState('');

  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingPyq, setLoadingPyq] = useState(false);
  const [loadingPractical, setLoadingPractical] = useState(false);
  const [loadingFees, setLoadingFees] = useState(true);

  const [openPdf, setOpenPdf] = useState<string | null>(null);

  /* AUTH */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setStudentName(payload.name || 'Student');
    } catch {}
  }, []);

  /* NOTES */
  useEffect(() => {
    if (!medium || !classNum || !subject) { setNotes([]); return; }
    const fetch_ = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(`/api/student/notes?medium=${medium}&class=${classNum}&subject=${subject}`);
        const data = await res.json();
        setNotes(data.notes || []);
      } catch { setNotes([]); } finally { setLoadingNotes(false); }
    };
    fetch_();
  }, [medium, classNum, subject]);

  /* PYQ */
  useEffect(() => {
    if (activeTab !== 'pyq' || !pyqMedium || !pyqClass || !pyqSubject) { setPyqs([]); return; }
    const fetch_ = async () => {
      setLoadingPyq(true);
      try {
        const res = await fetch(`/api/student/pyq?medium=${pyqMedium}&class=${pyqClass}&subject=${pyqSubject}`);
        const data = await res.json();
        setPyqs(data.pyq || []);
      } catch { setPyqs([]); } finally { setLoadingPyq(false); }
    };
    fetch_();
  }, [activeTab, pyqMedium, pyqClass, pyqSubject]);

  /* PRACTICAL */
  useEffect(() => {
    if (activeTab !== 'practical' || !practicalMedium || !practicalClass || !practicalSubject) { setPracticals([]); return; }
    const fetch_ = async () => {
      setLoadingPractical(true);
      try {
        const res = await fetch(`/api/student/practical?medium=${practicalMedium}&class=${practicalClass}&subject=${practicalSubject}`);
        const data = await res.json();
        setPracticals(data.practicals || []);
      } catch { setPracticals([]); } finally { setLoadingPractical(false); }
    };
    fetch_();
  }, [activeTab, practicalMedium, practicalClass, practicalSubject]);

  /* FEES */
  useEffect(() => {
    const fetch_ = async () => {
      setLoadingFees(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/fees', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setTotalFees(data?.total_fees ?? 0);
        setMonthlyFees(data?.monthly_fees ?? []);
      } catch { setTotalFees(0); setMonthlyFees([]); } finally { setLoadingFees(false); }
    };
    fetch_();
  }, []);

  /* PERFORMANCE */
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/performance', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setPerformance(data.performance || []);
      } catch {}
    };
    fetch_();
  }, []);

  /* DERIVED STATS */
  const avgPercent = performance.length
    ? Math.round(performance.reduce((a, p) => a + (p.marks / p.max_marks) * 100, 0) / performance.length)
    : 0;
  const bestScore = performance.length
    ? Math.round(Math.max(...performance.map(p => (p.marks / p.max_marks) * 100)))
    : 0;
  const sparkData = performance.map(p => Math.round((p.marks / p.max_marks) * 100));
  const unlockedBadges = BADGES.filter(b => b.unlockAt(performance, noteAccessCount));

  const navItems: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'notes', icon: <BookOpen size={18} />, label: 'Study Notes' },
    { id: 'pyq', icon: <FileText size={18} />, label: 'PYQ Papers' },
    { id: 'practical', icon: <FlaskConical size={18} />, label: 'Practicals' },
    { id: 'fees', icon: <IndianRupee size={18} />, label: 'Fees' },
    { id: 'performance', icon: <BarChart3 size={18} />, label: 'Performance' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex overflow-hidden">

      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64
        bg-[#0f0f1a] border-r border-white/[0.06] transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500
            flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Atom size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-none">Vikram Classes</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Student Portal</p>
          </div>
        </div>

        {/* STUDENT CARD */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10
            border border-white/[0.06] rounded-2xl p-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500
              flex items-center justify-center text-white font-black text-lg mb-3 shadow-lg">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-sm text-white">{studentName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active Student</p>
            {performance.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${avgPercent}%` }} />
                </div>
                <span className="text-[10px] text-indigo-400 font-bold">{avgPercent}%</span>
              </div>
            )}
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                font-medium transition-all duration-200 group
                ${activeTab === id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
            >
              <span className={activeTab === id ? 'text-indigo-400' : 'text-gray-600 group-hover:text-gray-400'}>
                {icon}
              </span>
              {label}
              {activeTab === id && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
              text-gray-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* TOP BAR */}
        <header className="flex items-center justify-between px-5 py-4
          bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-white text-base leading-none">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">Welcome back, {studentName.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06]
              rounded-xl px-3 py-2 text-sm text-gray-500">
              <Search size={14} />
              <span className="text-xs">Quick search...</span>
            </div>
            <button className="relative p-2 rounded-xl text-gray-500 hover:text-white
              hover:bg-white/[0.06] transition border border-white/[0.06]">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">

          {/* ─── NOTES ─── */}
          <AnimatePresence mode="wait">
            {activeTab === 'notes' && (
              <motion.div key="notes"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" placeholder="Search chapter..." value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                        pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600
                        focus:outline-none focus:border-indigo-500/50 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <DarkSelect label="Medium" value={medium} onChange={setMedium} options={['Hindi', 'English']} />
                  <DarkSelect label="Class" value={classNum} onChange={setClassNum} options={['11', '12']} />
                  <DarkSelect label="Subject" value={subject} onChange={setSubject} options={['Physics', 'Chemistry', 'Maths']} />
                </div>

                {loadingNotes && <LoadingDots />}

                {!loadingNotes && notes.length === 0 && (
                  <EmptyState icon={<BookOpen size={36} />}
                    title="No Notes Found"
                    desc="Select Medium, Class & Subject to view your study materials." />
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.filter(n => n.chapter_name.toLowerCase().includes(search.toLowerCase()))
                    .map((n, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5
                          hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20
                          flex items-center justify-center text-indigo-400 mb-4">
                          <BookOpen size={18} />
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mb-1">
                          {n.subject} • Class {n.class} • {n.medium}
                        </p>
                        <h3 className="font-bold text-white text-base leading-snug mb-4">{n.chapter_name}</h3>
                        <button
                          onClick={() => { setOpenPdf(n.pdf_url); setNoteAccessCount(c => c + 1); }}
                          className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20
                            text-indigo-300 text-sm font-semibold py-2 rounded-xl transition flex items-center
                            justify-center gap-2 group-hover:border-indigo-400/40">
                          <FileText size={14} /> Open Notes
                        </button>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* ─── PYQ ─── */}
            {activeTab === 'pyq' && (
              <motion.div key="pyq"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <DarkSelect label="Medium" value={pyqMedium} onChange={setPyqMedium} options={['Hindi', 'English']} />
                  <DarkSelect label="Class" value={pyqClass} onChange={setPyqClass} options={['11', '12']} />
                  <DarkSelect label="Subject" value={pyqSubject} onChange={setPyqSubject} options={['Chemistry', 'Physics', 'Biology']} />
                </div>

                {loadingPyq && <LoadingDots />}
                {!loadingPyq && pyqs.length === 0 && (
                  <EmptyState icon={<FileText size={36} />} title="No PYQ Found"
                    desc="Select filters above to load previous year question papers." />
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {pyqs.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5
                        hover:border-cyan-500/30 hover:bg-cyan-500/[0.03] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                        flex items-center justify-center text-cyan-400 mb-4">
                        <FileText size={18} />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{p.subject} • Class {p.class}</p>
                      <p className="text-xs text-gray-600 mb-4">Previous Year Question Paper</p>
                      <button onClick={() => setOpenPdf(p.pdf_url)}
                        className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20
                          text-cyan-300 text-sm font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2">
                        <FileText size={14} /> Open PYQ
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── PRACTICAL ─── */}
            {activeTab === 'practical' && (
              <motion.div key="practical"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <DarkSelect label="Medium" value={practicalMedium} onChange={setPracticalMedium} options={['Hindi', 'English']} />
                  <DarkSelect label="Class" value={practicalClass} onChange={setPracticalClass} options={['11', '12']} />
                  <DarkSelect label="Subject" value={practicalSubject} onChange={setPracticalSubject} options={['Physics', 'Chemistry', 'Biology']} />
                </div>

                {loadingPractical && <LoadingDots />}
                {!loadingPractical && practicals.length === 0 && (
                  <EmptyState icon={<FlaskConical size={36} />} title="No Practicals Found"
                    desc="Select filters above to load your practical PDFs." />
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {practicals.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5
                        hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20
                        flex items-center justify-center text-violet-400 mb-4">
                        <FlaskConical size={18} />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{p.subject} • Class {p.class}</p>
                      <p className="text-xs text-gray-600 mb-4">Practical PDF Document</p>
                      <button onClick={() => setOpenPdf(p.pdf_url)}
                        className="w-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20
                          text-violet-300 text-sm font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2">
                        <FileText size={14} /> Open Practical
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── FEES ─── */}
            {activeTab === 'fees' && (
              <motion.div key="fees"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {loadingFees ? <LoadingDots /> : (
                  <>
                    {/* TOTAL CARD */}
                    <div className="relative rounded-2xl overflow-hidden mb-6 p-6
                      bg-gradient-to-br from-emerald-500/20 to-teal-500/10
                      border border-emerald-500/20">
                      <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10
                        rounded-full blur-2xl" />
                      <p className="text-xs text-emerald-400 uppercase tracking-widest mb-2">Total Fees Paid</p>
                      <p className="text-4xl font-black text-white">₹ {totalFees.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 mt-2">Auto-updated from institute records</p>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                      Monthly Breakdown
                    </h3>

                    <div className="space-y-3">
                      {monthlyFees.map((f, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center justify-between bg-white/[0.03]
                            border border-white/[0.06] rounded-xl px-5 py-4 hover:border-emerald-500/20 transition">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                              flex items-center justify-center text-emerald-400 text-xs font-bold">₹</div>
                            <div>
                              <p className="font-semibold text-white text-sm">{f.month}</p>
                              <p className="text-xs text-gray-600">Monthly Fee</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-400 text-base">₹ {f.amount.toLocaleString()}</p>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400
                              border border-emerald-500/20 px-2 py-0.5 rounded-full">Paid</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ─── PERFORMANCE ─── */}
            {activeTab === 'performance' && (
              <motion.div key="performance"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {/* STAT CARDS ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Tests Taken', value: performance.length, color: 'indigo', icon: <FileText size={16} /> },
                    { label: 'Average Score', value: `${avgPercent}%`, color: 'cyan', icon: <TrendingUp size={16} /> },
                    { label: 'Best Score', value: `${bestScore}%`, color: 'amber', icon: <Star size={16} /> },
                    { label: 'Badges Earned', value: unlockedBadges.length, color: 'violet', icon: <Award size={16} /> },
                  ].map(({ label, value, color, icon }) => (
                    <div key={label}
                      className={`bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4
                        hover:border-${color}-500/30 transition`}>
                      <div className={`text-${color}-400 mb-3`}>{icon}</div>
                      <p className={`text-2xl font-black text-${color}-300`}>{value}</p>
                      <p className="text-xs text-gray-600 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* CHART */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-sm">Score Trend</h3>
                    {sparkData.length > 1 && <Sparkline data={sparkData} />}
                  </div>
                  <PerformanceChart data={performance} />
                </div>

                {/* BADGES */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                    <Trophy size={16} className="text-amber-400" /> Achievement Badges
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {BADGES.map(badge => {
                      const unlocked = badge.unlockAt(performance, noteAccessCount);
                      return (
                        <motion.div key={badge.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl
                            border text-center transition-all duration-300
                            ${unlocked
                              ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-lg ${badge.shadow}`
                              : 'bg-white/[0.02] border-white/[0.05] grayscale opacity-40'
                            }`}>
                          <div className={`${unlocked ? 'text-white' : 'text-gray-600'}`}>
                            {badge.icon}
                          </div>
                          <p className={`text-[11px] font-bold leading-tight ${unlocked ? 'text-white' : 'text-gray-600'}`}>
                            {badge.label}
                          </p>
                          <p className={`text-[9px] leading-tight ${unlocked ? 'text-white/70' : 'text-gray-700'}`}>
                            {badge.desc}
                          </p>
                          {unlocked && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full
                              flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* TEST LIST */}
                <div className="space-y-3">
                  {performance.length === 0 && (
                    <EmptyState icon={<BarChart3 size={36} />} title="No Tests Yet"
                      desc="Your test results will appear here once added by your teacher." />
                  )}
                  {performance.map((p, i) => {
                    const pct = Math.round((p.marks / p.max_marks) * 100);
                    const grade = pct >= 90 ? { label: 'A+', color: 'text-amber-400' }
                      : pct >= 75 ? { label: 'A', color: 'text-cyan-400' }
                      : pct >= 60 ? { label: 'B', color: 'text-indigo-400' }
                      : { label: 'C', color: 'text-rose-400' };
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07]
                          rounded-xl px-5 py-4 hover:border-indigo-500/20 transition">
                        <div className={`text-2xl font-black w-10 text-center ${grade.color}`}>
                          {grade.label}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{p.test_name}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {p.marks}/{p.max_marks} marks • {p.remarks}
                          </p>
                          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                pct >= 90 ? 'bg-amber-400' : pct >= 75 ? 'bg-cyan-400'
                                : pct >= 60 ? 'bg-indigo-400' : 'bg-rose-400'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-xl ${grade.color}`}>{pct}%</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ─── PDF MODAL ─── */}
      <AnimatePresence>
        {openPdf && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 py-3
              bg-[#0f0f1a] border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText size={14} />
                <span>PDF Viewer</span>
              </div>
              <button onClick={() => setOpenPdf(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-red-500/20
                  text-gray-400 hover:text-red-400 transition">
                <X size={16} />
              </button>
            </div>
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(openPdf)}&embedded=true`}
              className="flex-1 w-full border-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
function DarkSelect({ label, value, onChange, options }: any) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
        px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50
        transition appearance-none cursor-pointer">
      <option value="" className="bg-gray-900">Select {label}</option>
      {options.map((o: string) => (
        <option key={o} value={o} className="bg-gray-900">{o}</option>
      ))}
    </select>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2 py-16">
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          className="w-2 h-2 bg-indigo-500 rounded-full" />
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-gray-700 mb-4">{icon}</div>
      <p className="font-semibold text-gray-500 text-sm">{title}</p>
      <p className="text-xs text-gray-700 mt-1 max-w-xs">{desc}</p>
    </div>
  );
}
