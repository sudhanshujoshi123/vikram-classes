'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  IndianRupee,
  BookOpen,
  BarChart3,
  Search,
  LogOut,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ================= TYPES ================= */
interface Student {
  id: number;
  name: string;
  student_class: string;
  email?: string;
  total_paid?: number;
  amount?: number;
}

/* ================= PAGE ================= */
export default function AdminDashboard() {
  const router = useRouter();

  /* ===== AUTH ===== */
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) router.replace('/admin/login');
  }, [router]);

  /* ===== STATES ===== */
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] =
    useState<'students' | 'fees' | 'notes' | 'performance'>('students');

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

 const [perf, setPerf] = useState({
  student_id: '',
  test_name: '',
  marks: '',
  max_marks: '',
  remarks: '',
});

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const url =
      activeTab === 'fees'
        ? `/api/admin/fees?month=${month}`
        : '/api/admin/students';

    const res = await fetch(url);
    const data = await res.json();

    if (data.students) {
      setStudents(data.students);

      if (activeTab === 'fees') {
        const map: any = {};
        data.students.forEach((s: Student) => {
          map[s.id] = s.amount ?? 0;
        });
        setAmounts(map);
      }
    }
  };

  useEffect(() => {
    if (activeTab !== 'notes') fetchData();
  }, [activeTab, month]);

  /* ================= PERFORMANCE ================= */
  const performanceStats = useMemo(() => {
  const marks = Number(perf.marks);
  const max = Number(perf.max_marks);

  if (!marks || !max || max <= 0 || marks > max) return null;

  const percentage = Math.round((marks / max) * 100);

  let grade = 'C';
  let color = 'bg-yellow-500';

  if (percentage >= 90) {
    grade = 'A+';
    color = 'bg-green-500';
  } else if (percentage >= 75) {
    grade = 'A';
    color = 'bg-blue-500';
  } else if (percentage >= 60) {
    grade = 'B';
    color = 'bg-purple-500';
  }

  return { percentage, grade, color };
}, [perf.marks, perf.max_marks]);


  /* ================= ACTIONS ================= */
  const saveFees = async (student_id: number) => {
    const amount = amounts[student_id];
    if (!amount || amount <= 0) return alert('Enter valid amount');

    await fetch('/api/admin/fees/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, amount, month }),
    });

    fetchData();
  };

  const savePerformance = async () => {
    if (!perf.student_id || !perf.test_name || !perf.marks || !perf.max_marks) {
      return alert('Fill all required fields');
    }

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

    alert('Performance saved');
    setPerf({ student_id: '', test_name: '', marks: '', max_marks: '', remarks: '' });
  };

  const logout = () => {
    localStorage.clear();
    router.replace('/admin/login');
  };

  const filteredStudents = students.filter(s =>
    `${s.name} ${s.student_class} ${s.email ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 md:p-10">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Vikram Classes • Control Panel</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>

      {/* MOBILE MENU */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow"
        >
          <Menu size={18} /> Menu
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2"
            >
              <Tab icon={<Users />} label="Students" tab="students" />
              <Tab icon={<IndianRupee />} label="Fees" tab="fees" />
              <Tab icon={<BookOpen />} label="Notes" tab="notes" />
              <Tab icon={<BarChart3 />} label="Performance" tab="performance" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP TABS */}
      <div className="hidden md:flex gap-4 mb-8">
        <Tab icon={<Users />} label="Students" tab="students" />
        <Tab icon={<IndianRupee />} label="Fees" tab="fees" />
        <Tab icon={<BookOpen />} label="Notes" tab="notes" />
        <Tab icon={<BarChart3 />} label="Performance" tab="performance" />
      </div>

      {/* MONTH PICKER */}
      {activeTab === 'fees' && (
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border rounded-xl px-4 py-2 mb-6"
        />
      )}

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >

          {/* STUDENTS */}
          {activeTab === 'students' && (
            <GlassCard>
              {activeTab === 'students' && (
  <div className="max-w-6xl mx-auto">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-indigo-600">
          Students Management
        </h2>
        <p className="text-gray-500 text-sm">
          View & manage enrolled students
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, class, email"
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
        />
      </div>
    </div>

    {/* DESKTOP TABLE */}
    <div className="hidden md:block bg-white rounded-3xl shadow-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-indigo-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">Student</th>
            <th className="p-4 text-left">Class</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Total Fees</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(s => (
            <tr key={s.id} className="border-b hover:bg-indigo-50/40">
              <td className="p-4 font-semibold">{s.name}</td>
              <td className="p-4">Class {s.student_class}</td>
              <td className="p-4 text-gray-600">{s.email ?? '-'}</td>
              <td className="p-4 font-bold text-green-600">
                ₹{s.total_paid ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* MOBILE CARDS */}
    <div className="grid gap-4 md:hidden">
      {filteredStudents.map(s => (
        <div
          key={s.id}
          className="bg-white rounded-2xl shadow-lg p-5"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{s.name}</h3>
              <p className="text-sm text-gray-500">
                Class {s.student_class}
              </p>
            </div>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              ₹{s.total_paid ?? 0}
            </span>
          </div>

          <p className="text-sm text-gray-600 break-all">
            {s.email ?? 'No email provided'}
          </p>
        </div>
      ))}
    </div>

    {/* EMPTY STATE */}
    {filteredStudents.length === 0 && (
      <div className="text-center text-gray-500 mt-10">
        No students found
      </div>
    )}
  </div>
)}

            </GlassCard>
          )}

          {/* FEES */}
          {activeTab === 'fees' && (
            <GlassCard>
              <Table headers={['Name', 'Class', 'Amount', 'Action']}>
                {students.map(s => (
                  <tr key={s.id}>
                    <Cell>{s.name}</Cell>
                    <Cell>{s.student_class}</Cell>
                    <Cell>
                      <input
                        type="number"
                        className="border rounded-lg px-3 py-1 w-24"
                        value={amounts[s.id] ?? ''}
                        onChange={e =>
                          setAmounts({ ...amounts, [s.id]: Number(e.target.value) })
                        }
                      />
                    </Cell>
                    <Cell>
                      <button
                        onClick={() => saveFees(s.id)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600
                        text-white px-4 py-1 rounded-lg"
                      >
                        Save
                      </button>
                    </Cell>
                  </tr>
                ))}
              </Table>
            </GlassCard>
          )}

          {/* NOTES */}
          {activeTab === 'notes' && (
            <GlassCard className="text-center">
              <h2 className="text-2xl font-bold mb-4">Study Notes</h2>
              <button
                onClick={() => router.push('/admin/notes')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600
                text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Upload Notes
              </button>
            </GlassCard>
          )}

          {/* PERFORMANCE */}
          {activeTab === 'performance' && (
  <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8">

    {/* HEADER */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold text-indigo-600">
        Student Performance Entry
      </h2>
      <p className="text-gray-500 text-sm">
        Exam results & academic performance
      </p>
    </div>

    {/* STUDENT */}
    <label className="block mb-2 font-semibold">Student</label>
    <select
      value={perf.student_id}
      onChange={e => setPerf({ ...perf, student_id: e.target.value })}
      className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
    >
      <option value="">Select Student</option>
      {students.map(s => (
        <option key={s.id} value={s.id}>
          {s.name} — Class {s.student_class}
        </option>
      ))}
    </select>

    {/* EXAM INFO */}
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block mb-2 font-semibold">Exam Name</label>
        <input
          placeholder="Unit Test / Mid Term / Final"
          value={perf.test_name}
          onChange={e => setPerf({ ...perf, test_name: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Exam Type</label>
        <select
          className="w-full px-4 py-3 border rounded-xl"
          onChange={e => setPerf({ ...perf, remarks: e.target.value })}
        >
          <option value="">Written</option>
          <option value="Practical">Practical</option>
          <option value="Online">Online</option>
        </select>
      </div>
    </div>

    {/* MARKS */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block mb-2 font-semibold">Marks Obtained</label>
        <input
          type="number"
          value={perf.marks}
          onChange={e => setPerf({ ...perf, marks: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Maximum Marks</label>
        <input
          type="number"
          value={perf.max_marks}
          onChange={e => setPerf({ ...perf, max_marks: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>
    </div>

    {/* AUTO RESULT */}
    {performanceStats && (
      <div className="grid grid-cols-3 gap-3 text-center mb-6">
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Percentage</p>
          <p className="text-2xl font-bold text-indigo-600">
            {performanceStats.percentage}%
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Grade</p>
          <p className="text-2xl font-bold text-green-600">
            {performanceStats.grade}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${
          performanceStats.percentage >= 35
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          <p className="text-sm">Status</p>
          <p className="text-2xl font-bold">
            {performanceStats.percentage >= 35 ? 'PASS' : 'FAIL'}
          </p>
        </div>
      </div>
    )}

    {/* TEACHER REMARK */}
    <label className="block mb-2 font-semibold">Teacher Remark</label>
    <textarea
      rows={3}
      placeholder="Needs improvement / Excellent performance"
      value={perf.remarks}
      onChange={e => setPerf({ ...perf, remarks: e.target.value })}
      className="w-full mb-6 px-4 py-3 border rounded-xl resize-none"
    />

    {/* SAVE */}
    <button
      onClick={savePerformance}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
      text-white py-3 rounded-xl font-bold text-lg hover:opacity-90"
    >
      Save Result
    </button>
  </div>
)}


        </motion.div>
      </AnimatePresence>
    </div>
  );

  function Tab({ icon, label, tab }: any) {
    return (
      <button
        onClick={() => {
          setActiveTab(tab);
          setMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow
        ${activeTab === tab
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
          : 'bg-white hover:bg-indigo-50'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  }
}

/* ================= COMPONENTS ================= */

const GlassCard = ({ children, className = '' }: any) => (
  <motion.div
    initial={{ scale: 0.97, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const Table = ({ headers, children }: any) => (
  <table className="w-full min-w-[600px] text-sm">
    <thead>
      <tr className="text-gray-500 border-b">
        {headers.map((h: string) => (
          <th key={h} className="p-3 text-left">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

const Cell = ({ children, className = '' }: any) => (
  <td className={`p-3 ${className}`}>{children}</td>
);
