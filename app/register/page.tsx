'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, GraduationCap, UserPlus,
  Eye, EyeOff, Atom, LogIn, CheckCircle2
} from 'lucide-react';

export default function StudentRegister() {
  const router = useRouter();

  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [studentClass, setStudentClass] = useState('Class 11');
  const [password, setPassword]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);
  const [showPass, setShowPass]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, student_class: studentClass, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* input focus style helper */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: 42, paddingRight: 14,
    paddingTop: 11, paddingBottom: 11,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, color: '#e5e7eb', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#6b7280', fontSize: 11,
    fontWeight: 600, letterSpacing: '0.07em',
    textTransform: 'uppercase', marginBottom: 6,
  };

  const iconWrap: React.CSSProperties = {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)',
    color: '#4b5563', pointerEvents: 'none',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* ── GLOW ORBS ── */}
      <div style={{ position:'absolute', top:'8%', left:'5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'5%', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter:'blur(45px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)', filter:'blur(60px)', pointerEvents:'none' }} />

      {/* ── GRID ── */}
      <div style={{ position:'absolute', inset:0, opacity:0.03, backgroundImage:`linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize:'40px 40px', pointerEvents:'none' }} />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 440,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '36px 32px',
          backdropFilter: 'blur(20px)',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* TOP ACCENT */}
        <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(to right, transparent, rgba(6,182,212,0.6), transparent)', borderRadius:1 }} />

        {/* SUCCESS STATE */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute', inset: 0, borderRadius: 24,
                background: 'rgba(10,10,15,0.97)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 16, zIndex: 20,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid rgba(16,185,129,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={32} style={{ color: '#34d399' }} />
              </motion.div>
              <p style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Account Created!</p>
              <p style={{ color: '#6b7280', fontSize: 13 }}>Redirecting to login...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.2))',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(6,182,212,0.15)',
            }}>
              <UserPlus size={28} style={{ color: '#22d3ee' }} />
            </div>
          </motion.div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:'linear-gradient(135deg, #06b6d4, #6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Atom size={13} style={{ color: '#fff' }} />
            </div>
            <span style={{ color:'#9ca3af', fontSize:12, fontWeight:500, letterSpacing:'0.05em' }}>
              VIKRAM CLASSES
            </span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>
            Join the learning portal today
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* FULL NAME */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <div style={iconWrap}><User size={16} /></div>
              <input
                type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={iconWrap}><Mail size={16} /></div>
              <input
                type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* CLASS SELECT */}
          <div>
            <label style={labelStyle}>Select Class</label>
            <div style={{ position: 'relative' }}>
              <div style={iconWrap}><GraduationCap size={16} /></div>
              <select
                value={studentClass}
                onChange={e => setStudentClass(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: 14,
                  appearance: 'none',
                  cursor: 'pointer',
                }}
                onFocus={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <option value="Class 11" style={{ background: '#111' }}>Class 11</option>
                <option value="Class 12" style={{ background: '#111' }}>Class 12</option>
              </select>
              {/* CUSTOM ARROW */}
              <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'#4b5563', pointerEvents:'none', fontSize:10 }}>▼</div>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={iconWrap}><Lock size={16} /></div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Create a password"
                value={password} onChange={e => setPassword(e.target.value)} required
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer',
                  color:'#4b5563', padding:4, display:'flex', alignItems:'center',
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
                : 'linear-gradient(135deg, #06b6d4, #10b981)',
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
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </motion.button>
        </form>

        {/* DIVIDER */}
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
          <span style={{ color:'#374151', fontSize:11 }}>ALREADY REGISTERED?</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
        </div>

        {/* LOGIN LINK */}
        <button
          onClick={() => router.push('/login')}
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
          <LogIn size={15} />
          Login to existing account
        </button>

        {/* BOTTOM ACCENT */}
        <div style={{ position:'absolute', bottom:0, left:'30%', right:'30%', height:1, background:'linear-gradient(to right, transparent, rgba(6,182,212,0.4), transparent)', borderRadius:1 }} />
      </motion.div>
    </div>
  );
}
