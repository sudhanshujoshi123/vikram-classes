'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, IndianRupee, BarChart3, FileText, X,
  LogOut, Bell, Search, ChevronRight, Atom,
  FlaskConical, Menu
} from 'lucide-react';

type TabType = 'notes' | 'fees' | 'performance';

interface Note { 
  id: number;
  medium: string; 
  class: string; 
  subject: string; 
  chapter_name: string; 
  pdf_url: string;
}

interface MonthlyFee { month: string; amount: number; }
interface Performance { test_name: string; marks: number; max_marks: number; remarks: string; }

// Payment Modal Component
function PaymentModal({ 
  studentId, 
  className, 
  chapterId,
  chapterName,
  onSuccess, 
  onClose 
}: { 
  studentId: number; 
  className: string; 
  chapterId: number;
  chapterName: string;
  onSuccess: () => void; 
  onClose: () => void; 
}) {
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
        alert('✅ Payment submitted successfully!\n\nAdmin will verify within 24 hours.');
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Access Chapter - ₹3</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Chapter</p>
          <p className="text-white font-bold">{chapterName}</p>
          <p className="text-xs text-gray-400 mt-1">Class {className}</p>
        </div>

      <div className="bg-white rounded-2xl p-6 mb-4">
  <div className="text-center mb-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-2">
      <span className="text-2xl">पे</span>
      <span className="text-lg font-bold text-purple-900">PhonePe</span>
    </div>
    <p className="text-sm font-bold text-purple-900">ACCEPTED HERE</p>
    <p className="text-xs text-gray-600 mt-1">Scan & Pay Using PhonePe App</p>
  </div>
  
  {/* QR Code Image */}
<div className="bg-white border-2 border-purple-200 rounded-xl p-4 mb-3">
  <div className="w-48 mx-auto bg-white rounded-lg overflow-hidden border border-gray-200">
    <img 
      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=vikramclasses@ybl&pn=Vikram%20Classes&am=3&cu=INR`}
      alt="PhonePe QR Code"
      className="w-full h-auto"
    />
  </div>
  <p className="text-xs text-gray-600 text-center mt-2 font-semibold">Scan to Pay ₹3</p>
</div>
  
  <div className="text-center">
    <p className="text-xs text-gray-600 mb-1">Or pay to UPI ID:</p>
    <p className="text-sm font-bold text-gray-900 font-mono">
      {process.env.NEXT_PUBLIC_ADMIN_UPI_ID || '9557943342@axl'}
    </p>
    <p className="text-xs text-gray-500 mt-1">
      {process.env.NEXT_PUBLIC_ADMIN_UPI_NAME || 'Vikram Classes'}
    </p>
  </div>
</div>

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
      </motion.div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [studentName, setStudentName] = useState('Student');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [noteAccessCount, setNoteAccessCount] = useState(0);

  const [medium, setMedium] = useState('');
  const [classNum, setClassNum] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');

  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingFees, setLoadingFees] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [openPdf, setOpenPdf] = useState<string | null>(null);

  /* AUTH */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setStudentName(payload.name || 'Student');
      setStudentId(payload.id || payload.student_id || 1);
    } catch (error) {
      console.error('Token error:', error);
      localStorage.removeItem('token');
      router.replace('/login');
    }
  }, [router]);

  /* FETCH NOTES */
  useEffect(() => {
    if (!medium || !classNum || !subject) {
      setNotes([]);
      return;
    }
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(`/api/student/notes?medium=${medium}&class=${classNum}&subject=${subject}`);
        const data = await res.json();
        console.log('📚 Notes fetched:', data.notes);
        setNotes(data.notes || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [medium, classNum, subject]);

  /* FETCH FEES */
  useEffect(() => {
    const fetchFees = async () => {
      setLoadingFees(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/fees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTotalFees(data?.total_fees ?? 0);
        setMonthlyFees(data?.monthly_fees ?? []);
      } catch (error) {
        console.error('Error fetching fees:', error);
        setTotalFees(0);
        setMonthlyFees([]);
      } finally {
        setLoadingFees(false);
      }
    };
    fetchFees();
  }, []);

  /* FETCH PERFORMANCE */
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/student/performance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPerformance(data.performance || []);
      } catch (error) {
        console.error('Error fetching performance:', error);
      }
    };
    fetchPerformance();
  }, []);

  /* ACCESS NOTE */
  const accessNote = async (note: Note) => {
    console.log('📖 Note object:', note);
    console.log('📖 Note ID:', note.id);

    if (!studentId) {
      alert('Please login first');
      return;
    }

    const chapterId = note.id;
    
    if (!chapterId) {
      console.error('❌ Note has no ID:', note);
      alert('Invalid note - missing ID');
      return;
    }

    try {
      const res = await fetch('/api/notes/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: Number(studentId),
          chapterId: Number(chapterId),
          className: String(classNum),
        }),
      });

      const data = await res.json();
      console.log('📥 API Response:', data);

      if (data.requiresPayment) {
        setSelectedNote(note);
        setShowPaymentModal(true);
        return;
      }

      if (data.success) {
        // Open PDF in viewer modal instead of downloading
        setOpenPdf(data.note.url);
        setNoteAccessCount(c => c + 1);
      } else {
        alert(data.error || 'Failed to access notes');
      }
    } catch (error) {
      console.error('Error accessing note:', error);
      alert('Failed to access notes');
    }
  };

  /* DERIVED STATS */
  const avgPercent = performance.length
    ? Math.round(performance.reduce((a, p) => a + (p.marks / p.max_marks) * 100, 0) / performance.length)
    : 0;

  const bestScore = performance.length
    ? Math.round(Math.max(...performance.map(p => (p.marks / p.max_marks) * 100)))
    : 0;

  const navItems: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'notes', icon: <BookOpen size={18} />, label: 'Study Notes' },
    { id: 'fees', icon: <IndianRupee size={18} />, label: 'Fees' },
    { id: 'performance', icon: <BarChart3 size={18} />, label: 'Performance' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f0f1a] border-r border-white/[0.06] transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <Atom size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">Vikram Classes</p>
            <p className="text-[10px] text-gray-500">Student Portal</p>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-white/[0.06] rounded-2xl p-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg mb-3">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-sm text-white">{studentName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active Student</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'}`}
            >
              <span className={activeTab === id ? 'text-indigo-400' : 'text-gray-600'}>{icon}</span>
              {label}
              {activeTab === id && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:text-red-400 hover:bg-red-500/[0.06] transition">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="flex items-center justify-between px-5 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06]">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-white text-base">{navItems.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-gray-600 mt-0.5">Welcome back, {studentName.split(' ')[0]}</p>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <AnimatePresence mode="wait">
            
            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 uppercase">Medium</label>
                    <select value={medium} onChange={e => setMedium(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50">
                      <option value="">Select Medium</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 uppercase">Class</label>
                    <select value={classNum} onChange={e => setClassNum(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50">
                      <option value="">Select Class</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 uppercase">Subject</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50">
                      <option value="">Select Subject</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                  </div>
                </div>

                {loadingNotes && <div className="flex items-center justify-center py-16"><div className="text-gray-400">Loading notes...</div></div>}

                {!loadingNotes && notes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BookOpen size={48} className="text-gray-700 mb-4" />
                    <p className="font-semibold text-gray-500 text-sm">No Notes Found</p>
                    <p className="text-xs text-gray-700 mt-1">Select Medium, Class & Subject to view notes</p>
                  </div>
                )}

                {/* NOTES GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes
                    .filter(n => n.chapter_name.toLowerCase().includes(search.toLowerCase()))
                    .map((note: any, index: number) => (
                      <motion.div 
                        key={note.id || index}
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                          <BookOpen size={18} />
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mb-1">{note.subject} • Class {note.class}</p>
                        <h3 className="font-bold text-white text-base leading-snug mb-2">{note.chapter_name}</h3>
                        <p className="text-xs text-gray-500 mb-4">₹3 for 3 months access</p>
                        <button 
                          onClick={() => accessNote(note)} 
                          className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-sm font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <BookOpen size={14} /> Access Notes
                        </button>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* FEES TAB */}
            {activeTab === 'fees' && (
              <motion.div key="fees" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {loadingFees ? (
                  <div className="flex items-center justify-center py-16"><div className="text-gray-400">Loading fees...</div></div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
                      <p className="text-xs text-emerald-400 uppercase tracking-widest mb-2">Total Fees Paid</p>
                      <p className="text-4xl font-black text-white">₹ {totalFees.toLocaleString()}</p>
                    </div>
                    <div className="space-y-3">
                      {monthlyFees.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No fee records found</div>
                      ) : (
                        monthlyFees.map((fee, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">₹</div>
                              <div>
                                <p className="font-semibold text-white text-sm">{fee.month}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-400 text-base">₹ {fee.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <motion.div key="performance" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                    <p className="text-2xl font-black text-indigo-300">{performance.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Tests Taken</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                    <p className="text-2xl font-black text-cyan-300">{avgPercent}%</p>
                    <p className="text-xs text-gray-600 mt-1">Average Score</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                    <p className="text-2xl font-black text-amber-300">{bestScore}%</p>
                    <p className="text-xs text-gray-600 mt-1">Best Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {performance.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No test records found</div>
                  ) : (
                    performance.map((perf, i) => {
                      const pct = Math.round((perf.marks / perf.max_marks) * 100);
                      return (
                        <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{perf.test_name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{perf.marks}/{perf.max_marks} marks</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xl text-indigo-400">{pct}%</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && selectedNote && studentId && (
          <PaymentModal
            studentId={studentId}
            className={classNum}
            chapterId={selectedNote.id}
            chapterName={selectedNote.chapter_name}
            onSuccess={() => {
              setShowPaymentModal(false);
              setSelectedNote(null);
            }}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedNote(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* PDF VIEWER MODAL */}
      <AnimatePresence>
        {openPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0f0f1a] border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText size={14} />
                <span>PDF Viewer</span>
              </div>
              <button 
                onClick={() => setOpenPdf(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-900">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(openPdf)}&embedded=true`}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}