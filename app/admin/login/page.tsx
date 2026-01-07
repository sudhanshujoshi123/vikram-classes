'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🔒 Mock admin login (replace with API later)
    if (email === 'vs@gmail.com' && password === '2592') {
      localStorage.setItem(
        'admin',
        JSON.stringify({ name: 'Admin', email })
      );
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
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

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4
        bg-white/10 backdrop-blur-xl border border-white/20
        rounded-3xl shadow-2xl p-8 md:p-10 text-white"
      >

        {/* HEADER */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-4"
          >
            <div className="bg-purple-500/20 text-purple-300 p-4 rounded-2xl shadow-lg">
              <ShieldCheck size={32} />
            </div>
          </motion.div>

          <h1 className="text-3xl font-extrabold tracking-wide">
            Admin Login
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Secure administrator access
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="bg-red-500/20 border border-red-500/30
            text-red-300 p-3 rounded-xl mb-5 text-sm text-center"
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <AnimatedInput
            icon={<Mail size={18} />}
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={setEmail}
            ring="focus:ring-purple-400"
          />

          <AnimatedInput
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            ring="focus:ring-purple-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2
            bg-gradient-to-r from-purple-500 to-indigo-600
            py-3 rounded-xl font-semibold shadow-xl"
          >
            <LogIn size={18} />
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

/* ================= ANIMATED INPUT ================= */

function AnimatedInput({
  icon,
  type,
  placeholder,
  value,
  onChange,
  ring,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  ring: string;
}) {
  return (
    <div className="relative transition-transform duration-300
    focus-within:scale-[1.02]">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-black/40
        border border-white/20 text-white placeholder-gray-400
        focus:outline-none focus:ring-2 ${ring}`}
      />
    </div>
  );
}
