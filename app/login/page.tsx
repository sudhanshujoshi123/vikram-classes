'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4
        bg-white/10 backdrop-blur-2xl border border-white/20
        rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        p-8 md:p-10 text-white"
      >

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="bg-cyan-500/20 text-cyan-300 p-4 rounded-2xl"
            >
              <GraduationCap size={34} />
            </motion.div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-wide">
            Student Login
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Login to your Vikram Classes dashboard
          </p>
        </motion.div>

        {/* ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30
              text-red-300 p-3 rounded-xl mb-5 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <AnimatedInput
            icon={<Mail size={18} />}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
          />

          <AnimatedInput
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-cyan-500 to-blue-600
              py-3 rounded-xl font-semibold shadow-xl
              disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
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
      </motion.div>
    </div>
  );
}

/* ================= INPUT ================= */

function AnimatedInput({
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
    <div className="relative transition-transform duration-300
      focus-within:scale-[1.02]"
    >
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
