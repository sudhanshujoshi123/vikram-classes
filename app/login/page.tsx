'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, GraduationCap, Eye, EyeOff, Atom, UserPlus } from 'lucide-react';

export default function StudentLogin() {
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">

      {/* ── BACKGROUND GLOW ORBS ── */}
      <div style={{
        position: 'absolute', top: '10%', right: '8%',
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '12%', left: '6%',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        filter: 'blur(45px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: '45%', transform: 'translate(-50%,-50%)',
        width: 550, height: 550, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* ── GRID PATTERN ── */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '36px 32px',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* TOP ACCENT LINE */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.6), transparent)',
          borderRadius: 1,
        }} />

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* ICON */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(6,182,212,0.15)',
            }}>
              <GraduationCap size={28} style={{ color: '#22d3ee' }} />
            </div>
          </motion.div>

          {/* BRAND */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Atom size={13} style={{ color: '#fff' }} />
            </div>
            <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em' }}>
              VIKRAM CLASSES
            </span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Student Login
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>
            Welcome back! Login to your learning portal
          </p>
        </div>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12, padding: '10px 14px',
                color: '#fca5a5', fontSize: 13, textAlign: 'center',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* EMAIL */}
          <div>
            <label style={{
              display: 'block', color: '#6b7280', fontSize: 11,
              fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#4b5563', pointerEvents: 'none',
              }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', paddingLeft: 42, paddingRight: 14,
                  paddingTop: 11, paddingBottom: 11,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, color: '#e5e7eb', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{
              display: 'block', color: '#6b7280', fontSize: 11,
              fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#4b5563', pointerEvents: 'none',
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', paddingLeft: 42, paddingRight: 44,
                  paddingTop: 11, paddingBottom: 11,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, color: '#e5e7eb', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4b5563', padding: 4,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%', marginTop: 8,
              padding: '12px 0',
              background: loading
                ? 'rgba(6,182,212,0.3)'
                : 'linear-gradient(135deg, #06b6d4, #6366f1)',
              border: 'none', borderRadius: 13,
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(6,182,212,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                  }}
                />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* DIVIDER */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: '#374151', fontSize: 11 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* REGISTER LINK */}
        <button
          onClick={() => router.push('/register')}
          style={{
            width: '100%', padding: '11px 0',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 13, color: '#9ca3af',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(6,182,212,0.3)';
            (e.currentTarget as HTMLButtonElement).style.color = '#22d3ee';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
          }}
        >
          <UserPlus size={15} />
          New student? Register here
        </button>

        {/* BOTTOM ACCENT LINE */}
        <div style={{
          position: 'absolute', bottom: 0, left: '30%', right: '30%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.4), transparent)',
          borderRadius: 1,
        }} />
      </motion.div>
    </div>
  );
}
