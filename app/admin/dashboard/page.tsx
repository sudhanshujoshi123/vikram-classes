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

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) router.replace('/admin/login');
  }, [router]);

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

    const percentage = Number(((marks / max) * 100).toFixed(1));
    let grade = 'C';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 75) grade = 'A';
    else if (percentage >= 60) grade = 'B';

    return { percentage, grade };
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
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Vikram Classes • Chemistry Management
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>

      {/* MOBILE TAB MENU */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow"
        >
          <Menu size={18} /> Menu
        </button>

        {menuOpen && (
          <div className="mt-3 space-y-2">
            <Tab icon={<Users />} label="Students" tab="students" />
            <Tab icon={<IndianRupee />} label="Fees" tab="fees" />
            <Tab icon={<BookOpen />} label="Notes" tab="notes" />
            <Tab icon={<BarChart3 />} label="Performance" tab="performance" />
          </div>
        )}
      </div>

      {/* DESKTOP TABS */}
      <div className="hidden md:flex gap-4 mb-8">
        <Tab icon={<Users />} label="Students" tab="students" />
        <Tab icon={<IndianRupee />} label="Fees" tab="fees" />
        <Tab icon={<BookOpen />} label="Notes" tab="notes" />
        <Tab icon={<BarChart3 />} label="Performance" tab="performance" />
      </div>

      {/* MONTH */}
      {activeTab === 'fees' && (
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border rounded-xl px-4 py-2 mb-6"
        />
      )}

      {/* STUDENTS */}
      {activeTab === 'students' && (
        <GlassCard>
          <div className="flex gap-3 mb-4">
            <Search size={18} />
            <input
              placeholder="Search student..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <Table headers={['Name', 'Class', 'Email', 'Total Fees']}>
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <Cell>{s.name}</Cell>
                  <Cell>{s.student_class}</Cell>
                  <Cell className="hidden sm:table-cell">{s.email ?? '-'}</Cell>
                  <Cell className="font-bold text-green-600">
                    ₹{s.total_paid ?? 0}
                  </Cell>
                </tr>
              ))}
            </Table>
          </div>
        </GlassCard>
      )}

      {/* FEES */}
      {activeTab === 'fees' && (
        <GlassCard>
          <div className="overflow-x-auto">
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
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-lg"
                    >
                      Save
                    </button>
                  </Cell>
                </tr>
              ))}
            </Table>
          </div>
        </GlassCard>
      )}

      {/* NOTES */}
      {activeTab === 'notes' && (
        <GlassCard className="text-center">
          <h2 className="text-2xl font-bold mb-4">Study Notes</h2>
          <button
            onClick={() => router.push('/admin/notes')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl"
          >
            Upload Notes
          </button>
        </GlassCard>
      )}

      {/* PERFORMANCE */}
      {activeTab === 'performance' && (
        <GlassCard className="max-w-xl">
          <h2 className="text-2xl font-bold mb-6">Student Performance</h2>

          <select
            className="border rounded-lg p-3 w-full mb-4"
            value={perf.student_id}
            onChange={e => setPerf({ ...perf, student_id: e.target.value })}
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input
            className="border rounded-lg p-3 w-full mb-4"
            placeholder="Test Name"
            value={perf.test_name}
            onChange={e => setPerf({ ...perf, test_name: e.target.value })}
          />

          <div className="flex gap-3 mb-4">
            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              placeholder="Marks"
              value={perf.marks}
              onChange={e => setPerf({ ...perf, marks: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              placeholder="Max Marks"
              value={perf.max_marks}
              onChange={e => setPerf({ ...perf, max_marks: e.target.value })}
            />
          </div>

          {performanceStats && (
            <div className="mb-4 p-4 rounded-xl bg-indigo-50 text-center font-semibold">
              {performanceStats.percentage}% • Grade {performanceStats.grade}
            </div>
          )}

          <textarea
            className="border rounded-lg p-3 w-full mb-4"
            placeholder="Remarks"
            value={perf.remarks}
            onChange={e => setPerf({ ...perf, remarks: e.target.value })}
          />

          <button
            onClick={savePerformance}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
          >
            Save Performance
          </button>
        </GlassCard>
      )}
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
  <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 ${className}`}>
    {children}
  </div>
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
