'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Layers,
  GraduationCap, Book, CheckCircle2,
  X, ArrowLeft, Atom
} from 'lucide-react';

export default function UploadPYQ() {
  const router = useRouter();

  const [medium, setMedium]   = useState('');
  const [cls, setCls]         = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const uploadPYQ = async () => {
    if (!medium || !cls || !subject || !file) {
      setError('Please fill all fields and upload a PDF.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('medium', medium);
    formData.append('class', cls);
    formData.append('subject', subject);
    formData.append('pdf', file);

    try {
      const res = await fetch('/api/admin/pyq', { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setMedium(''); setCls(''); setSubject(''); setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#6b7280', fontSize: 11,
    fontWeight: 600, letterSpacing: '0.07em',
    textTransform: 'uppercase', marginBottom: 6,
  };

  const selectBase: React.CSSProperties = {
    width: '100%', paddingLeft: 42, paddingRight: 28,
    paddingTop: 11, paddingBottom: 11,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, color: '#e5e7eb', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', appearance: 'none', cursor: 'pointer',
  };

  const fields = [
    { label: 'Medium',  icon: <Layers size={16} />,        value: medium,  onChange: setMedium,  options: ['Hindi', 'English'],               prefix: '' },
    { label: 'Class',   icon: <GraduationCap size={16} />, value: cls,     onChange: setCls,     options: ['11', '12'],                       prefix: 'Class ' },
    { label: 'Subject', icon: <Book size={16} />,           value: subject, onChange: setSubject, options: ['Physics', 'Chemistry', 'Biology'], prefix: '' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* GLOW ORBS */}
      <div style={{ position:'absolute', top:'8%', left:'6%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'5%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter:'blur(45px)', pointerEvents:'none' }} />

      {/* GRID PATTERN */}
      <div style={{ position:'absolute', inset:0, opacity:0.03, backgroundImage:`linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize:'40px 40px', pointerEvents:'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 500,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '36px 32px',
          backdropFilter: 'blur(20px)',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* TOP ACCENT — cyan for PYQ */}
        <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(to right, transparent, rgba(6,182,212,0.6), transparent)', borderRadius:1 }} />

        {/* SUCCESS OVERLAY */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ position:'absolute', inset:0, borderRadius:24, background:'rgba(10,10,15,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, zIndex:20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type:'spring', stiffness:200, delay:0.1 }}
                style={{ width:72, height:72, borderRadius:'50%', background:'rgba(16,185,129,0.15)', border:'2px solid rgba(16,185,129,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}
              >
                <CheckCircle2 size={32} style={{ color:'#34d399' }} />
              </motion.div>
              <p style={{ color:'#fff', fontSize:18, fontWeight:800 }}>PYQ Uploaded!</p>
              <p style={{ color:'#6b7280', fontSize:13 }}>PDF saved successfully</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => router.push('/admin/dashboard')}
            style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:12, marginBottom:20, padding:0 }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))', border:'1px solid rgba(6,182,212,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FileText size={22} style={{ color:'#22d3ee' }} />
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <div style={{ width:18, height:18, borderRadius:5, background:'linear-gradient(135deg,#06b6d4,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Atom size={11} style={{ color:'#fff' }} />
                </div>
                <span style={{ color:'#6b7280', fontSize:11, fontWeight:600, letterSpacing:'0.05em' }}>VIKRAM CLASSES</span>
              </div>
              <h1 style={{ color:'#fff', fontSize:20, fontWeight:800, margin:0 }}>Upload PYQ</h1>
              <p style={{ color:'#6b7280', fontSize:12, marginTop:2 }}>Admin • Previous Year Questions</p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity:0, height:0, marginBottom:0 }}
              animate={{ opacity:1, height:'auto', marginBottom:20 }}
              exit={{ opacity:0, height:0, marginBottom:0 }}
              style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'10px 14px', color:'#fca5a5', fontSize:13, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}
            >
              <span>{error}</span>
              <button onClick={() => setError('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#fca5a5', padding:0, display:'flex' }}>
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* SELECT GRID */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {fields.map(({ label, icon, value, onChange, options, prefix }) => (
              <div key={label} style={{ gridColumn: label === 'Subject' ? '1 / -1' : 'auto' }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#4b5563', pointerEvents:'none' }}>{icon}</div>
                  <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={selectBase}
                    onFocus={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(6,182,212,0.5)'}
                    onBlur={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <option value="" style={{ background:'#111' }}>Select {label}</option>
                    {options.map((o: string) => (
                      <option key={o} value={o} style={{ background:'#111' }}>{prefix}{o}</option>
                    ))}
                  </select>
                  <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#4b5563', pointerEvents:'none', fontSize:10 }}>▼</div>
                </div>
              </div>
            ))}
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label style={labelStyle}>PDF File</label>
            <label
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
                border: file ? '1px solid rgba(16,185,129,0.35)' : '1px dashed rgba(6,182,212,0.3)',
                borderRadius:16, padding:'28px 20px', cursor:'pointer', transition:'all 0.2s',
                background: file ? 'rgba(16,185,129,0.05)' : 'rgba(6,182,212,0.03)',
              }}
              onMouseEnter={e => !file && ((e.currentTarget as HTMLLabelElement).style.background = 'rgba(6,182,212,0.07)')}
              onMouseLeave={e => !file && ((e.currentTarget as HTMLLabelElement).style.background = 'rgba(6,182,212,0.03)')}
            >
              {file ? (
                <>
                  <div style={{ width:48, height:48, borderRadius:14, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle2 size={24} style={{ color:'#34d399' }} />
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#34d399', fontSize:13, fontWeight:600 }}>{file.name}</p>
                    <p style={{ color:'#6b7280', fontSize:11, marginTop:4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width:48, height:48, borderRadius:14, background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <UploadCloud size={24} style={{ color:'#22d3ee' }} />
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'#9ca3af', fontSize:13, fontWeight:500 }}>Click to upload PDF</p>
                    <p style={{ color:'#4b5563', fontSize:11, marginTop:3 }}>Only .pdf files accepted</p>
                  </div>
                </>
              )}
              <input type="file" accept="application/pdf" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* SUBMIT */}
          <motion.button
            onClick={uploadPYQ}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width:'100%', marginTop:4, padding:'13px 0',
              background: loading ? 'rgba(6,182,212,0.3)' : 'linear-gradient(135deg, #06b6d4, #6366f1)',
              border:'none', borderRadius:13, color:'#fff', fontSize:14, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(6,182,212,0.3)',
              transition:'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff' }}
                />
                Uploading...
              </>
            ) : (
              <><UploadCloud size={16} /> Upload PYQ</>
            )}
          </motion.button>
        </div>

        {/* BOTTOM ACCENT */}
        <div style={{ position:'absolute', bottom:0, left:'30%', right:'30%', height:1, background:'linear-gradient(to right, transparent, rgba(6,182,212,0.4), transparent)', borderRadius:1 }} />
      </motion.div>
    </div>
  );
}
