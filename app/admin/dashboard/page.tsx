'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, IndianRupee, BookOpen, BarChart3, Search,
  LogOut, Menu, X, ChevronRight, Atom, FileText,
  FlaskConical, TrendingUp, CheckCircle2, AlertCircle,
  GraduationCap, Save, Upload, Award, CreditCard, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── TYPES ─── */
interface Student {
  id: number;
  name: string;
  student_class: string;
  email?: string;
  total_paid?: number;
  amount?: number;
}

interface Payment {
  id: number;
  student_id: number;
  student_name: string;
  email: string;
  class_name: string;
  utr_number: string;
  amount: number;
  status: string;
  created_at: string;
}

type TabType = 'students' | 'fees' | 'notes' | 'pyq' | 'practical' | 'performance' | 'payments';

/* ─── STAT CARD ─── */
function StatCard({ label, value, icon, iconColor, iconBg, valueColor }: {
  label: string; value: string | number; icon: React.ReactNode;
  iconColor: string; iconBg: string; valueColor: string;
}) {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '16px',
      minWidth: 0,
      overflow: 'hidden',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{
        color: valueColor, fontSize: 20, fontWeight: 800,
        lineHeight: 1.2, marginBottom: 4,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
      <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── DARK INPUT ─── */
function DarkInput({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
          px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600
          focus:outline-none focus:border-indigo-500/50 transition"
      />
    </div>
  );
}

/* ─── DARK SELECT ─── */
function DarkSelect({ label, value, onChange, children }: any) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
          px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50
          transition appearance-none cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

/* ─── LOADING DOTS ─── */
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

/* ─── PAGINATION ─── */
function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter(p =>
    p === 1 || p === total || Math.abs(p - page) <= 1
  );

  const withEllipsis: (number | '...')[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && (p as number) - (visible[i - 1] as number) > 1) withEllipsis.push('...');
    withEllipsis.push(p);
  });

  return (
    <div className="flex items-center justify-between mt-5 px-1">
      <p className="text-xs text-gray-600">
        Page <span className="text-gray-400 font-semibold">{page}</span> of{' '}
        <span className="text-gray-400 font-semibold">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
            bg-white/[0.04] border border-white/[0.08] text-gray-400
            hover:text-white hover:bg-white/[0.08] disabled:opacity-30
            disabled:cursor-not-allowed transition-all duration-150"
        >
          ← Prev
        </button>

        {withEllipsis.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-2 text-gray-600 text-xs select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                p === page
                  ? { background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7280' }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === total}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
            bg-white/[0.04] border border-white/[0.08] text-gray-400
            hover:text-white hover:bg-white/[0.08] disabled:opacity-30
            disabled:cursor-not-allowed transition-all duration-150"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) router.replace('/admin/login');
  }, [router]);

  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(null);

  const [perf, setPerf] = useState({
    student_id: '', test_name: '', marks: '', max_marks: '', remarks: '',
  });

  /* FETCH */
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'fees'
        ? `/api/admin/fees?month=${month}`
        : '/api/admin/students';
      const res = await fetch(url);
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
        if (activeTab === 'fees') {
          const map: any = {};
          data.students.forEach((s: Student) => { map[s.id] = s.amount ?? 0; });
          setAmounts(map);
        }
      }
    } finally { setLoading(false); }
  };

  /* FETCH PAYMENTS */
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify-payment');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    } else if (activeTab !== 'notes' && activeTab !== 'pyq' && activeTab !== 'practical') {
      fetchData();
    }
  }, [activeTab, month]);

  /* DERIVED STATS */
  const totalFees = students.reduce((a, s) => a + (Number(s.total_paid) || 0), 0);
  const filteredStudents = students.filter(s =>
    `${s.name} ${s.student_class} ${s.email ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const PAGE_SIZE = 10;
  const [studentsPage, setStudentsPage] = useState(1);
  const [feesPage, setFeesPage] = useState(1);

  useEffect(() => { setStudentsPage(1); setFeesPage(1); }, [search]);
  useEffect(() => { setStudentsPage(1); }, [activeTab]);

  const studentsTotalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const feesTotalPages     = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));

  const paginatedStudents = filteredStudents.slice((studentsPage - 1) * PAGE_SIZE, studentsPage * PAGE_SIZE);
  const paginatedFees     = filteredStudents.slice((feesPage - 1)     * PAGE_SIZE, feesPage     * PAGE_SIZE);

  /* PAYMENT ACTIONS */
  const handlePaymentAction = async (paymentId: number, studentId: number, className: string, action: 'verify' | 'reject') => {
    if (action === 'verify') {
      if (!confirm('Are you sure you want to verify this payment and activate subscription for 3 months?')) return;
    } else {
      if (!confirm('Are you sure you want to reject this payment?')) return;
    }

    setProcessingPaymentId(paymentId);

    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, studentId, className, action }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Payment ${action === 'verify' ? 'verified' : 'rejected'} successfully!`);
        fetchPayments();
      } else {
        alert(data.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Something went wrong');
    } finally {
      setProcessingPaymentId(null);
    }
  };

  /* PERFORMANCE PREVIEW */
  const performanceStats = useMemo(() => {
    const marks = Number(perf.marks);
    const max = Number(perf.max_marks);
    if (!marks || !max || max <= 0 || marks > max) return null;
    const pct = Math.round((marks / max) * 100);
    const grade = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : 'C';
    const color = pct >= 90 ? 'amber' : pct >= 75 ? 'cyan' : pct >= 60 ? 'indigo' : 'rose';
    return { pct, grade, color, pass: pct >= 35 };
  }, [perf.marks, perf.max_marks]);

  /* ACTIONS */
  const saveFees = async (student_id: number) => {
    const amount = amounts[student_id];
    if (!amount || amount <= 0) return;
    await fetch('/api/admin/fees/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, amount, month }),
    });
    setSavedIds(ids => [...ids, student_id]);
    setTimeout(() => setSavedIds(ids => ids.filter(id => id !== student_id)), 2000);
    fetchData();
  };

  const savePerformance = async () => {
    if (!perf.student_id || !perf.test_name || !perf.marks || !perf.max_marks) return;
    await fetch('/api/admin/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: Number(perf.student_id),
        test_name: perf.test_name,
        marks: Number(perf.marks),
        max_marks: Number(perf.max_marks),
        remarks: perf.remarks,
      }),
    });
    setPerf({ student_id: '', test_name: '', marks: '', max_marks: '', remarks: '' });
  };

  const logout = () => { localStorage.clear(); router.replace('/admin/login'); };

  const navItems: { id: TabType; icon: React.ReactNode; label: string; badge?: string }[] = [
    { id: 'students', icon: <Users size={17} />, label: 'Students', badge: String(students.length || '') },
    { id: 'fees', icon: <IndianRupee size={17} />, label: 'Fees' },
    { id: 'payments', icon: <CreditCard size={17} />, label: 'Payments', badge: String(payments.length || '') },
    { id: 'notes', icon: <BookOpen size={17} />, label: 'Notes' },
    { id: 'pyq', icon: <FileText size={17} />, label: 'PYQ Papers' },
    { id: 'practical', icon: <FlaskConical size={17} />, label: 'Practicals' },
    { id: 'performance', icon: <BarChart3 size={17} />, label: 'Performance' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex overflow-hidden">

      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64
        bg-[#0f0f1a] border-r border-white/[0.06] transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500
            flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Atom size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-none">Vikram Classes</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* ADMIN BADGE */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10
            border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500
              flex items-center justify-center text-white font-black text-base shadow-lg">
              A
            </div>
            <div>
              <p className="font-bold text-sm text-white">Administrator</p>
              <p className="text-[10px] text-violet-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Active Session
              </p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, icon, label, badge }) => (
            <button key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); setSearch(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                font-medium transition-all duration-200 group
                ${activeTab === id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}>
              <span className={activeTab === id ? 'text-violet-400' : 'text-gray-600 group-hover:text-gray-400'}>
                {icon}
              </span>
              <span className="flex-1 text-left">{label}</span>
              {badge && badge !== '0' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold
                  ${activeTab === id ? 'bg-violet-500/30 text-violet-300' : 'bg-white/[0.06] text-gray-500'}`}>
                  {badge}
                </span>
              )}
              {activeTab === id && <ChevronRight size={13} className="text-violet-400" />}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
              text-gray-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* BACKDROP */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* TOPBAR */}
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
              <p className="text-xs text-gray-600 mt-0.5">Vikram Classes Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(activeTab === 'students' || activeTab === 'fees') && (
              <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06]
                rounded-xl px-3 py-2">
                <Search size={13} className="text-gray-600" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="bg-transparent text-xs text-gray-300 placeholder-gray-600
                    outline-none w-36"
                />
              </div>
            )}
            <button onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] border border-white/[0.06]
                hover:border-red-500/20 transition-all duration-200">
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <AnimatePresence mode="wait">

            {/* ─── PAYMENTS ─── */}
            {activeTab === 'payments' && (
              <motion.div key="payments"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {/* STATS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}
                  className="lg:grid-cols-3">
                  <StatCard
                    label="Pending Payments"
                    value={payments.filter(p => p.status === 'pending').length}
                    icon={<CreditCard size={16} />}
                    iconColor="#fbbf24" iconBg="rgba(245,158,11,0.15)" valueColor="#fcd34d"
                  />
                  <StatCard
                    label="Total Revenue"
                    value={`₹${payments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0)}`}
                    icon={<IndianRupee size={16} />}
                    iconColor="#34d399" iconBg="rgba(16,185,129,0.15)" valueColor="#6ee7b7"
                  />
                  <StatCard
                    label="Total Transactions"
                    value={payments.length}
                    icon={<TrendingUp size={16} />}
                    iconColor="#818cf8" iconBg="rgba(99,102,241,0.15)" valueColor="#a5b4fc"
                  />
                </div>

                {loading ? <LoadingDots /> : (
                  <>
                    {payments.length === 0 ? (
                      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
                        <CreditCard size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg font-semibold">No pending payments</p>
                        <p className="text-gray-600 text-sm mt-2">All payments have been processed</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Student</p>
                                <p className="font-semibold text-white">{payment.student_name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{payment.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Class</p>
                                <p className="font-semibold text-white">{payment.class_name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                                <p className="font-bold text-2xl" style={{ color: '#6ee7b7' }}>₹{payment.amount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">UTR Number</p>
                                <p className="font-mono text-sm text-gray-300 bg-white/[0.04] px-3 py-1.5 rounded-lg inline-block">
                                  {payment.utr_number}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                <p className="text-sm text-gray-400">
                                  {new Date(payment.created_at).toLocaleString('en-IN')}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                  ${payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                    payment.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                  {payment.status === 'pending' && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />}
                                  {payment.status === 'completed' && <CheckCircle2 size={12} />}
                                  {payment.status === 'rejected' && <XCircle size={12} />}
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            {payment.status === 'pending' && (
                              <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                                <button
                                  onClick={() => handlePaymentAction(payment.id, payment.student_id, payment.class_name, 'verify')}
                                  disabled={processingPaymentId === payment.id}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                    bg-emerald-500/20 text-emerald-300 border border-emerald-500/30
                                    hover:bg-emerald-500/30 transition-all duration-200 font-semibold text-sm
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingPaymentId === payment.id ? (
                                    'Processing...'
                                  ) : (
                                    <><CheckCircle2 size={16} /> Verify & Activate (3 months)</>
                                  )}
                                </button>
                                <button
                                  onClick={() => handlePaymentAction(payment.id, payment.student_id, payment.class_name, 'reject')}
                                  disabled={processingPaymentId === payment.id}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                    bg-red-500/20 text-red-300 border border-red-500/30
                                    hover:bg-red-500/30 transition-all duration-200 font-semibold text-sm
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingPaymentId === payment.id ? (
                                    'Processing...'
                                  ) : (
                                    <><XCircle size={16} /> Reject</>
                                  )}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ─── STUDENTS ─── */}
            {activeTab === 'students' && (
              <motion.div key="students"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {/* STATS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}
                  className="lg:grid-cols-4">
                  <StatCard
                    label="Total Students"
                    value={students.length}
                    icon={<Users size={16} />}
                    iconColor="#818cf8" iconBg="rgba(99,102,241,0.15)" valueColor="#a5b4fc"
                  />
                  <StatCard
                    label="Fees Collected"
                    value={`₹${Math.round(totalFees).toLocaleString('en-IN')}`}
                    icon={<IndianRupee size={16} />}
                    iconColor="#34d399" iconBg="rgba(16,185,129,0.15)" valueColor="#6ee7b7"
                  />
                  <StatCard
                    label="Classes"
                    value="11 & 12"
                    icon={<GraduationCap size={16} />}
                    iconColor="#22d3ee" iconBg="rgba(6,182,212,0.15)" valueColor="#67e8f9"
                  />
                  <StatCard
                    label="Portal Status"
                    value="Live ✓"
                    icon={<CheckCircle2 size={16} />}
                    iconColor="#a78bfa" iconBg="rgba(139,92,246,0.15)" valueColor="#c4b5fd"
                  />
                </div>

                {/* SEARCH MOBILE */}
                <div className="sm:hidden relative mb-4">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                      pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                </div>

                {loading ? <LoadingDots /> : (
                  <>
                    {/* COUNT INFO */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-600">
                        Showing{' '}
                        <span className="text-gray-400 font-semibold">
                          {Math.min((studentsPage - 1) * PAGE_SIZE + 1, filteredStudents.length)}–{Math.min(studentsPage * PAGE_SIZE, filteredStudents.length)}
                        </span>{' '}
                        of <span className="text-gray-400 font-semibold">{filteredStudents.length}</span> students
                      </p>
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.06]">
                            {['#', 'Student', 'Class', 'Email', 'Total Fees'].map(h => (
                              <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedStudents.length === 0 && (
                            <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-600 text-sm">No students found</td></tr>
                          )}
                          {paginatedStudents.map((s, i) => (
                            <motion.tr key={s.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                              <td className="px-5 py-4 text-gray-700 text-xs font-mono">
                                {(studentsPage - 1) * PAGE_SIZE + i + 1}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                                    {s.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-white text-sm">{s.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-gray-400 text-sm">Class {s.student_class}</td>
                              <td className="px-5 py-4 text-gray-500 text-xs">{s.email ?? '—'}</td>
                              <td className="px-5 py-4">
                                <span className="font-bold" style={{ color: '#6ee7b7' }}>
                                  ₹{Number(s.total_paid ?? 0).toLocaleString('en-IN')}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="grid gap-3 md:hidden">
                      {paginatedStudents.map((s, i) => (
                        <motion.div key={s.id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{s.name}</p>
                              <p className="text-xs text-gray-600">Class {s.student_class}</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#6ee7b7' }}>
                            ₹{Number(s.total_paid ?? 0).toLocaleString('en-IN')}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* PAGINATION */}
                    <Pagination page={studentsPage} total={studentsTotalPages} onChange={setStudentsPage} />
                  </>
                )}
              </motion.div>
            )}

            {/* ─── FEES ─── */}
            {activeTab === 'fees' && (
              <motion.div key="fees"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {/* MONTH PICKER */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08]
                    rounded-xl px-4 py-2.5">
                    <IndianRupee size={14} className="text-emerald-400" />
                    <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                      className="bg-transparent text-sm text-gray-200 outline-none" />
                  </div>
                  <span className="text-xs text-gray-600">Select month to manage fees</span>
                </div>

                {/* SEARCH MOBILE */}
                <div className="sm:hidden relative mb-4">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                      pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                </div>

                {loading ? <LoadingDots /> : (
                  <>
                    {/* COUNT INFO */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-600">
                        Showing{' '}
                        <span className="text-gray-400 font-semibold">
                          {Math.min((feesPage - 1) * PAGE_SIZE + 1, filteredStudents.length)}–{Math.min(feesPage * PAGE_SIZE, filteredStudents.length)}
                        </span>{' '}
                        of <span className="text-gray-400 font-semibold">{filteredStudents.length}</span> students
                      </p>
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.06]">
                            {['#', 'Student', 'Class', 'Amount (₹)', 'Action'].map(h => (
                              <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedFees.length === 0 && (
                            <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-600 text-sm">No students found</td></tr>
                          )}
                          {paginatedFees.map((s, i) => (
                            <motion.tr key={s.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                              <td className="px-5 py-4 text-gray-700 text-xs font-mono">
                                {(feesPage - 1) * PAGE_SIZE + i + 1}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                                    {s.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-white text-sm">{s.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-gray-400 text-sm">Class {s.student_class}</td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold" style={{ color: '#34d399' }}>₹</span>
                                  <input type="number"
                                    value={amounts[s.id] ?? ''}
                                    onChange={e => setAmounts({ ...amounts, [s.id]: Number(e.target.value) })}
                                    className="w-28 bg-white/[0.04] border border-white/[0.08] rounded-xl
                                      px-3 py-1.5 text-sm text-gray-200 focus:outline-none
                                      focus:border-emerald-500/50 transition" />
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <button onClick={() => saveFees(s.id)}
                                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold
                                    transition-all duration-200
                                    ${savedIds.includes(s.id)
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-white/[0.06] text-gray-300 border border-white/[0.08] hover:border-emerald-500/30 hover:text-emerald-400'
                                    }`}>
                                  {savedIds.includes(s.id)
                                    ? <><CheckCircle2 size={13} /> Saved</>
                                    : <><Save size={13} /> Save</>}
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="grid gap-3 md:hidden">
                      {paginatedFees.map((s, i) => (
                        <motion.div key={s.id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                              style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{s.name}</p>
                              <p className="text-xs text-gray-600">Class {s.student_class}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
                              <span className="text-sm font-bold" style={{ color: '#34d399' }}>₹</span>
                              <input type="number" placeholder="Amount"
                                value={amounts[s.id] ?? ''}
                                onChange={e => setAmounts({ ...amounts, [s.id]: Number(e.target.value) })}
                                className="flex-1 bg-transparent text-sm text-gray-200 outline-none" />
                            </div>
                            <button onClick={() => saveFees(s.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition
                                ${savedIds.includes(s.id)
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                                }`}>
                              {savedIds.includes(s.id) ? '✓' : 'Save'}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* PAGINATION */}
                    <Pagination page={feesPage} total={feesTotalPages} onChange={setFeesPage} />
                  </>
                )}
              </motion.div>
            )}

            {/* ─── UPLOAD PAGES (Notes / PYQ / Practical) ─── */}
            {(activeTab === 'notes' || activeTab === 'pyq' || activeTab === 'practical') && (
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                {[
                  { id: 'notes',     icon: <BookOpen size={28} />,    label: 'Study Notes',          route: '/admin/notes',     desc: 'Upload chapter-wise notes PDFs for students to access in their portal.',         styles: { border:'#6366f130', iconBg:'#6366f115', iconBorder:'#6366f130', iconText:'#818cf8', btnBg:'#6366f115', btnBorder:'#6366f130', btnText:'#a5b4fc' } },
                  { id: 'pyq',       icon: <FileText size={28} />,    label: 'Previous Year Papers', route: '/admin/pyq',       desc: 'Upload previous year question papers filtered by class and subject.',           styles: { border:'#06b6d430', iconBg:'#06b6d415', iconBorder:'#06b6d430', iconText:'#22d3ee', btnBg:'#06b6d415', btnBorder:'#06b6d430', btnText:'#67e8f9' } },
                  { id: 'practical', icon: <FlaskConical size={28} />, label: 'Practical PDFs',       route: '/admin/practical', desc: 'Upload lab practicals and experiment guides for students.',                     styles: { border:'#8b5cf630', iconBg:'#8b5cf615', iconBorder:'#8b5cf630', iconText:'#a78bfa', btnBg:'#8b5cf615', btnBorder:'#8b5cf630', btnText:'#c4b5fd' } },
                ].filter(x => x.id === activeTab).map(({ icon, label, route, desc, styles }) => (
                  <div key={label} className="max-w-lg mx-auto">
                    <div className="bg-white/[0.03] rounded-3xl p-10 text-center transition-all duration-300"
                      style={{ border: `1px solid ${styles.border}` }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: styles.iconBg, border: `1px solid ${styles.iconBorder}`, color: styles.iconText }}>
                        {icon}
                      </div>
                      <h2 className="text-xl font-black text-white mb-2">{label}</h2>
                      <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">{desc}</p>
                      <button onClick={() => router.push(route)}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                        style={{ background: styles.btnBg, border: `1px solid ${styles.btnBorder}`, color: styles.btnText }}>
                        <Upload size={16} /> Upload PDF
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ─── PERFORMANCE ─── */}
            {activeTab === 'performance' && (
              <motion.div key="performance"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 md:p-8">

                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20
                        flex items-center justify-center text-violet-400">
                        <Award size={22} />
                      </div>
                      <div>
                        <h2 className="font-black text-white text-lg">Add Test Result</h2>
                        <p className="text-xs text-gray-600">Enter student exam performance below</p>
                      </div>
                    </div>

                    <div className="space-y-4">

                      {/* STUDENT */}
                      <DarkSelect label="Student" value={perf.student_id}
                        onChange={(e: any) => setPerf({ ...perf, student_id: e.target.value })}>
                        <option value="" className="bg-gray-900">Select Student</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id} className="bg-gray-900">
                            {s.name} — Class {s.student_class}
                          </option>
                        ))}
                      </DarkSelect>

                      {/* EXAM INFO */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <DarkInput label="Exam Name" value={perf.test_name}
                          onChange={(e: any) => setPerf({ ...perf, test_name: e.target.value })}
                          placeholder="Unit Test / Mid Term / Final" />
                        <DarkSelect label="Exam Type" value={perf.remarks}
                          onChange={(e: any) => setPerf({ ...perf, remarks: e.target.value })}>
                          <option value="Written" className="bg-gray-900">Written</option>
                          <option value="Practical" className="bg-gray-900">Practical</option>
                          <option value="Online" className="bg-gray-900">Online</option>
                        </DarkSelect>
                      </div>

                      {/* MARKS */}
                      <div className="grid grid-cols-2 gap-4">
                        <DarkInput label="Marks Obtained" value={perf.marks} type="number"
                          onChange={(e: any) => setPerf({ ...perf, marks: e.target.value })}
                          placeholder="e.g. 78" />
                        <DarkInput label="Maximum Marks" value={perf.max_marks} type="number"
                          onChange={(e: any) => setPerf({ ...perf, max_marks: e.target.value })}
                          placeholder="e.g. 100" />
                      </div>

                      {/* LIVE PREVIEW */}
                      <AnimatePresence>
                        {performanceStats && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-3 gap-3">
                            {(() => {
                              const pctColor = performanceStats.pct >= 90
                                ? { bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)', text:'#fcd34d' }
                                : performanceStats.pct >= 75
                                ? { bg:'rgba(6,182,212,0.12)', border:'rgba(6,182,212,0.25)', text:'#67e8f9' }
                                : performanceStats.pct >= 60
                                ? { bg:'rgba(99,102,241,0.12)', border:'rgba(99,102,241,0.25)', text:'#a5b4fc' }
                                : { bg:'rgba(244,63,94,0.12)', border:'rgba(244,63,94,0.25)', text:'#fda4af' };
                              const passColor = performanceStats.pass
                                ? { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)', text:'#6ee7b7' }
                                : { bg:'rgba(244,63,94,0.12)', border:'rgba(244,63,94,0.25)', text:'#fda4af' };
                              return [
                                { label: 'Percentage', value: `${performanceStats.pct}%`, ...pctColor },
                                { label: 'Grade',      value: performanceStats.grade,      ...pctColor },
                                { label: 'Result',     value: performanceStats.pass ? 'PASS' : 'FAIL', ...passColor },
                              ].map(({ label, value, bg, border, text }) => (
                                <div key={label} className="rounded-xl p-4 text-center"
                                  style={{ background: bg, border: `1px solid ${border}` }}>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                                  <p className="text-xl font-black" style={{ color: text }}>{value}</p>
                                </div>
                              ));
                            })()}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* PROGRESS BAR PREVIEW */}
                      {performanceStats && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                            <span>Score</span><span>{performanceStats.pct}%</span>
                          </div>
                          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${performanceStats.pct}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-full"
                              style={{ background: performanceStats.pct >= 90 ? 'linear-gradient(to right,#fbbf24,#fb923c)' : performanceStats.pct >= 75 ? 'linear-gradient(to right,#22d3ee,#2dd4bf)' : performanceStats.pct >= 60 ? 'linear-gradient(to right,#818cf8,#a78bfa)' : 'linear-gradient(to right,#fb7185,#f472b6)' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* REMARKS */}
                      <div>
                        <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">
                          Teacher Remarks
                        </label>
                        <textarea rows={3}
                          value={perf.remarks}
                          onChange={e => setPerf({ ...perf, remarks: e.target.value })}
                          placeholder="Excellent performance / Needs improvement in organic chemistry..."
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                            px-4 py-3 text-sm text-gray-200 placeholder-gray-600
                            focus:outline-none focus:border-violet-500/50 transition resize-none" />
                      </div>

                      {/* SAVE BUTTON */}
                      <button onClick={savePerformance}
                        disabled={!perf.student_id || !perf.test_name || !perf.marks || !perf.max_marks}
                        className="w-full bg-gradient-to-r from-violet-500 to-indigo-600
                          text-white py-3 rounded-2xl font-bold text-sm transition-all duration-200
                          hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed
                          shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                        <Save size={16} /> Save Performance Result
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}