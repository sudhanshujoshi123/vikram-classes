'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  UserPlus,
} from 'lucide-react';

export default function StudentRegister() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('Class 11');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          student_class: studentClass,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      alert('Registered successfully!');
      router.push('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* REGISTER CARD */}
      <div
        className="relative z-10 w-full max-w-md mx-4
        bg-white/10 backdrop-blur-xl border border-white/20
        rounded-3xl shadow-2xl p-8 md:p-10 text-white"
      >

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-cyan-500/20 text-cyan-300 p-4 rounded-2xl">
              <GraduationCap size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-wide">
            Student Registration
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Join Vikram Classes learning portal
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300
            p-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <InputField
            icon={<User size={18} />}
            placeholder="Full Name"
            value={name}
            onChange={setName}
            type="text"
          />

          <InputField
            icon={<Mail size={18} />}
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
          />

          {/* CLASS */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Class
            </label>
            <div className="relative">
              <GraduationCap
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl
                bg-black/40 border border-white/20 text-white
                focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
          </div>

          <InputField
            icon={<Lock size={18} />}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            type="password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
            bg-gradient-to-r from-cyan-500 to-blue-600
            py-3 rounded-xl font-semibold shadow-xl
            hover:scale-105 transition disabled:opacity-60"
          >
            <UserPlus size={18} />
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Already registered?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-cyan-300 font-semibold hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= INPUT FIELD ================= */

function InputField({
  icon,
  placeholder,
  value,
  onChange,
  type,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40
        border border-white/20 text-white placeholder-gray-400
        focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      />
    </div>
  );
}
