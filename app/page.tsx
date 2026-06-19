'use client';
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  BookOpen, BarChart3, ShieldCheck, UserPlus, LogIn, Lock,
  Phone, Mail, User, Star, Award, Users, ChevronDown, Atom,
  FlaskConical, Beaker, GraduationCap, CheckCircle2
} from 'lucide-react';

/* ─── SMOOTH SCROLL ─── */
function useLenis() {
  useEffect(() => {
    let lenis: any;
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1, touchMultiplier: 1 });
      const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    });
    return () => lenis?.destroy();
  }, []);
}

/* ─── NAV ─── */
function Navbar({ router }: { router: any }) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
      px-6 md:px-10 py-4 backdrop-blur-xl bg-black/50 border-b border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500
        flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Atom size={18} className="text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">Vikram Classes</span>
      </div>

      <div className="hidden md:flex items-center gap-2">
        {[
          { label: "Features", id: "features" },
          { label: "Teacher", id: "teacher" },
          { label: "Toppers", id: "toppers" },
          { label: "Contact", id: "contact" },
        ].map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white
            hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <NavBtn label="Login" onClick={() => router.push('/login')} variant="ghost" />
        <NavBtn label="Register" onClick={() => router.push('/register')} variant="solid" />
      </div>
    </motion.nav>
  );
}

function NavBtn({ label, onClick, variant }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${variant === 'solid'
        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-cyan-500/25'
        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/20'
      }`}
    >
      {label}
    </button>
  );
}

/* ─── HERO ─── */
function Hero({ router }: { router: any }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* BG */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/chemistry-bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
      </motion.div>

      {/* ANIMATED PARTICLES */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/10 border border-cyan-400/20"
          style={{
            width: `${[300, 200, 150, 400, 100, 250][i]}px`,
            height: `${[300, 200, 150, 400, 100, 250][i]}px`,
            top: `${[10, 60, 20, 40, 70, 5][i]}%`,
            left: `${[5, 70, 45, 80, 20, 30][i]}%`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
        />
      ))}

      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-24">

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm mb-8"
        >
          <Star size={14} className="fill-current" />
          <span>Trusted by 100+ Students • 10+ Years of Excellence</span>
        </motion.div>

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-indigo-400/20"
          />
          <motion.img
            src="/logo.png"
            alt="Vikram Classes"
            className="absolute inset-0 w-full h-full object-contain p-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Master Chemistry
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500
          bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl font-bold">
            Class 11 & 12
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From concept clarity to board results — master Chemistry at Vikram Classes
          with structured notes, weekly tests, and personal mentoring by an expert.
        </motion.p>

        {/* STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {[
            { icon: <Users size={16} />, label: "100+ Students" },
            { icon: <Award size={16} />, label: "10+ Yrs Experience" },
            { icon: <Star size={16} className="fill-current" />, label: "99/100 Top Score" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-cyan-400">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap"
        >
          <HeroBtn label="Register Now" icon={<UserPlus size={18} />}
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30" />
          <HeroBtn label="Student Login" icon={<LogIn size={18} />}
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30" />
          <HeroBtn label="Admin Panel" icon={<Lock size={18} />}
            onClick={() => router.push('/admin/login')}
            className="bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20" />
        </motion.div>

        {/* SCROLL HINT */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 flex flex-col items-center text-gray-500 text-xs gap-1"
        >
          <span>Scroll to explore</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/919557943342" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3
        bg-green-500 text-white text-sm font-semibold rounded-full shadow-xl
        shadow-green-500/40 hover:scale-105 hover:shadow-green-500/60 transition-all duration-300">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp Us
      </a>
    </section>
  );
}

function HeroBtn({ label, icon, onClick, className }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl
      text-white font-semibold text-sm transition-all duration-200 ${className}`}
    >
      {icon}{label}
    </motion.button>
  );
}

/* ─── STATS STRIP ─── */
function StatsStrip() {
  const stats = [
    { value: "100+", label: "Students Mentored", icon: <Users size={22} /> },
    { value: "10+", label: "Years of Teaching", icon: <Award size={22} /> },
    { value: "99%", label: "Board Exam Focus", icon: <CheckCircle2 size={22} /> },
    { value: "3", label: "Chemistry Streams", icon: <Beaker size={22} /> },
  ];
  return (
    <section className="py-12 px-6 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-violet-500/10
    border-y border-white/10">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label, icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-2 text-cyan-400">{icon}</div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
function Features() {
  const feats = [
    {
      icon: <BookOpen size={32} />,
      title: "Structured Notes",
      desc: "NCERT-aligned notes that simplify complex chemistry into logical, exam-ready content. Physical, Organic, and Inorganic — all covered.",
      color: "from-cyan-500/20 to-cyan-500/5",
      accent: "text-cyan-400",
      border: "border-cyan-500/20",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Performance Tracking",
      desc: "Weekly tests, detailed analytics, and progress reports. Students can clearly track their real growth and improvement every week.",
      color: "from-indigo-500/20 to-indigo-500/5",
      accent: "text-indigo-400",
      border: "border-indigo-500/20",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Secure Learning Portal",
      desc: "A modern digital portal — notes, tests, and performance all in one place. Secure login, role-based access, and organized content.",
      color: "from-emerald-500/20 to-emerald-500/5",
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      icon: <FlaskConical size={32} />,
      title: "PYQ Practice",
      desc: "Practice with previous year questions to understand board exam patterns. Get a real exam feel and build confidence before the big day.",
      color: "from-violet-500/20 to-violet-500/5",
      accent: "text-violet-400",
      border: "border-violet-500/20",
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Personal Mentoring",
      desc: "Every student receives individual attention. Doubts, exam strategy, and academic guidance — the teacher is directly involved in your progress.",
      color: "from-rose-500/20 to-rose-500/5",
      accent: "text-rose-400",
      border: "border-rose-500/20",
    },
    {
      icon: <Atom size={32} />,
      title: "Concept-First Approach",
      desc: "No rote learning — only deep conceptual clarity. Once the concept is clear, every type of question becomes solvable with confidence.",
      color: "from-amber-500/20 to-amber-500/5",
      accent: "text-amber-400",
      border: "border-amber-500/20",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border
          border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest mb-5">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Why Students Trust
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Vikram Classes
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Concept clarity, consistent practice, and continuous evaluation —
            these three pillars define every success story at Vikram Classes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feats.map(({ icon, title, desc, color, accent, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative rounded-3xl p-8 bg-gradient-to-br ${color}
              border ${border} backdrop-blur-sm overflow-hidden group`}
            >
              <div className={`${accent} mb-5 group-hover:scale-110 transition-transform duration-300 w-fit`}>
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full
              ${accent.replace('text-', 'bg-')}/5 blur-2xl`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TEACHER SECTION ─── */
function TeacherSection() {
  return (
    <section id="teacher" className="py-28 px-6 bg-slate-950 relative overflow-hidden">
      {/* BG GLOW */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96
      bg-cyan-500/8 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96
      bg-indigo-500/8 blur-[120px] rounded-full" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border
          border-indigo-500/20 text-indigo-400 text-xs uppercase tracking-widest mb-5">
            Meet Your Mentor
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Expert Behind
            </span>{" "}
            Your Success
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* PHOTO SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            {/* DECORATIVE RINGS */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-dashed border-cyan-400/20"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="w-56 h-56 md:w-64 md:h-64 rounded-full border border-indigo-400/15"
              />
            </div>

            {/* PHOTO CONTAINER */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative z-10 w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden
              ring-4 ring-cyan-400/30 shadow-2xl shadow-cyan-500/20"
            >
              {/* 
                👇 ADD TEACHER'S REAL PHOTO HERE
                Place the image at /public/teacher/vikram-sir.jpg
              */}
              <img
                src="/teacher/vikram-sir.jpg"
                alt="Mr. Vikram Singh Rawat"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback if image is not found
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  t.parentElement!.classList.add('teacher-fallback');
                }}
              />
              {/* FALLBACK PLACEHOLDER — shown until real image is added */}
              <div className="teacher-fallback-ui absolute inset-0 hidden items-center
              justify-center bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex-col gap-3">
                <GraduationCap size={48} className="text-cyan-400" />
                <span className="text-white text-xs font-medium text-center px-4">
                  Photo: /public/teacher/vikram-sir.jpg
                </span>
              </div>
            </motion.div>

            {/* FLOATING BADGES */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-2 right-8 md:right-12 z-20
              bg-black/80 border border-cyan-400/30 rounded-2xl px-4 py-2 backdrop-blur-md"
            >
              <div className="text-cyan-400 font-bold text-lg">10+</div>
              <div className="text-gray-400 text-xs">Years Exp.</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-6 left-4 md:left-8 z-20
              bg-black/80 border border-indigo-400/30 rounded-2xl px-4 py-2 backdrop-blur-md"
            >
              <div className="text-indigo-400 font-bold text-lg">100+</div>
              <div className="text-gray-400 text-xs">Students</div>
            </motion.div>
          </motion.div>

          {/* INFO SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-6">
              <CheckCircle2 size={13} className="fill-current" />
              Chemistry Expert — Class 11 & 12
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
              Mr. Vikram Singh Rawat
            </h3>
            <p className="text-cyan-400 font-semibold mb-6">
              Founder & Head Chemistry Mentor
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              With over 10 years of experience teaching Class 11 and 12 Chemistry,
            Mr. Rawat follows a concept-first approach — not rote learning, but deep understanding.
            His students consistently achieve outstanding marks in board examinations.
            </p>

            {/* HIGHLIGHTS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Physical Chemistry", color: "cyan" },
                { label: "Organic Chemistry", color: "indigo" },
                { label: "Inorganic Chemistry", color: "violet" },
                { label: "Board Exam Strategy", color: "emerald" },
              ].map(({ label, color }) => (
                <div key={label}
                  className={`flex items-center gap-2 text-sm text-gray-300`}>
                  <div className={`w-2 h-2 rounded-full bg-${color}-400 flex-shrink-0`} />
                  {label}
                </div>
              ))}
            </div>

            {/* CONTACT */}
            <div className="flex flex-col gap-3">
              <a href="tel:9557943342"
                className="flex items-center gap-3 text-sm text-gray-300
                hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20
                flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Phone size={16} className="text-green-400" />
                </div>
                +91 9557943342
              </a>
              <a href="mailto:vikramsinghrawat86@gmail.com"
                className="flex items-center gap-3 text-sm text-gray-300
                hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Mail size={16} className="text-cyan-400" />
                </div>
                vikramsinghrawat86@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── TOPPERS ─── */
function Toppers() {
  const toppers = [
    { img: "/toppers/neha.png", name: "Neha Bisht", year: "2024", marks: "99/100", rank: 1 },
    { img: "/toppers/komal.png", name: "Komal Bhatt", year: "2024", marks: "95/100", rank: 2 },
    { img: "/toppers/Mahaveer.png", name: "Mahaveer Gour", year: "2023", marks: "91/100", rank: 3 },
    { img: "/toppers/harshit.png", name: "Harshit Singh", year: "2023", marks: "88/100", rank: 4 },
  ];

  return (
    <section id="toppers" className="py-28 px-6 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1
      bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
      bg-cyan-500/5 blur-[100px] rounded-full" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border
          border-amber-500/20 text-amber-400 text-xs uppercase tracking-widest mb-5">
            Hall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Achievers
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
          These students are the pride of Vikram Classes — their hard work and dedication
            have earned outstanding results in board examinations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toppers.map(({ img, name, year, marks, rank }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12, scale: 1.03 }}
              className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-8 text-center group"
            >
              {/* RANK BADGE */}
              {rank === 1 && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full
                bg-amber-500 flex items-center justify-center">
                  <Star size={14} className="text-white fill-current" />
                </div>
              )}

              {/* GLOW on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-br from-cyan-500/10 to-indigo-500/10" />

              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative z-10 w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden
                ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20"
              >
                <img src={img} alt={name} className="w-full h-full object-cover" />
              </motion.div>

              <h3 className="relative z-10 font-bold text-white text-lg mb-1">{name}</h3>
              <p className="relative z-10 text-gray-500 text-xs mb-3">{year}</p>
              <div className="relative z-10 inline-block px-4 py-1.5 rounded-full
              bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-sm">
                {marks}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <section id="contact" className="py-28 px-6 bg-gradient-to-b from-black to-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border
          border-indigo-500/20 text-indigo-400 text-xs uppercase tracking-widest mb-5">
            Reach Out
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get In{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            For admissions, course details, or any queries — feel free to reach out directly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactCard
            role="Chemistry Mentor & Founder"
            name="Mr. Vikram Singh Rawat"
            phone="9557943342"
            emails={["vikramsinghrawat86@gmail.com"]}
            gradient="from-cyan-500/10 to-teal-500/10"
            border="border-cyan-500/20"
            accent="text-cyan-400"
            delay={0}
          />
          <ContactCard
            role="System Architect & Developer"
            name="Mr. Sudhanshu Joshi"
            phone="7900431779"
            emails={["sudhanshu24r@gmail.com"]}
            gradient="from-indigo-500/10 to-violet-500/10"
            border="border-indigo-500/20"
            accent="text-indigo-400"
            delay={0.15}
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({ role, name, phone, emails, gradient, border, accent, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className={`rounded-3xl p-8 bg-gradient-to-br ${gradient}
      border ${border} relative overflow-hidden group`}
    >
      <p className={`text-xs uppercase tracking-widest ${accent} mb-5 font-medium`}>{role}</p>

      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 border ${border}
        flex items-center justify-center`}>
          <User size={20} className={accent} />
        </div>
        <h3 className="text-white font-bold text-xl">{name}</h3>
      </div>

      <div className="space-y-3">
        <a href={`tel:${phone}`}
          className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group/link">
          <Phone size={16} className="text-green-400" />
          <span>{phone}</span>
        </a>
        {emails.map((e: string) => (
          <a key={e} href={`mailto:${e}`}
            className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors break-all">
            <Mail size={16} className={accent} />
            <span>{e}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/10 bg-black">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center
      justify-between gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500
          flex items-center justify-center">
            <Atom size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold">Vikram Classes</span>
        </div>
        <p className="text-center max-w-md">
          Trusted Chemistry coaching for Class 11 & 12 —
          conceptual clarity, academic discipline, consistent results.
        </p>
        <p>© {new Date().getFullYear()} Vikram Classes</p>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  const router = useRouter();
  useLenis();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white scroll-smooth overflow-x-hidden">
      <Navbar router={router} />
      <Hero router={router} />
      <StatsStrip />
      <Features />
      <TeacherSection />
      <Toppers />
      <Contact />
      <Footer />
    </div>
  );
}
