'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';

export default function StudentLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/student/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* LOGIN CARD */}
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
            Student Login
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Login to your Vikram Classes dashboard
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
        <form onSubmit={handleLogin} className="space-y-5">

          <InputField
            icon={<Mail size={18} />}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
          />

          <InputField
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-cyan-500 to-blue-600
              py-3 rounded-xl font-semibold shadow-xl
              hover:scale-105 transition disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Don&apos;t have an account?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-cyan-300 font-semibold hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= INPUT FIELD ================= */

function InputField({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
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
