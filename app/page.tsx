'use client';
import { motion , useMotionValue} from "framer-motion";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  BarChart3,
  ShieldCheck,
  UserPlus,
  LogIn,
  Lock,
  Phone,
  Mail,
  User,
} from 'lucide-react';

/* ================= GHOST BUTTON ================= */
function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-medium
      bg-white/10 hover:bg-white/25 backdrop-blur-md
      border border-white/20 text-white transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg active:scale-95"
    >
      {label}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
  {/* BASIC SEO */}
  <title>
    Vikram Classes – Best Chemistry Coaching for Class 11 & 12 | Board & Competitive Prep
  </title>

  <meta
    name="description"
    content="Vikram Classes offers the best Chemistry coaching for Class 11 & 12 students. Learn with clear concepts, structured notes, personal mentoring and proven topper results."
  />

  <meta
    name="keywords"
    content="
    Vikram Classes,
    Chemistry Coaching,
    Class 11 Chemistry Coaching,
    Class 12 Chemistry Coaching,
    Board Exam Chemistry,
    Best Chemistry Teacher,
    Chemistry Tuition Near Me,
    NCERT Chemistry,
    Competitive Exam Chemistry
    "
  />

  <meta name="author" content="Vikram Classes" />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  {/* OPEN GRAPH (Facebook / WhatsApp) */}
  <meta property="og:title" content="Vikram Classes – Chemistry Excellence for Class 11 & 12" />
  <meta
    property="og:description"
    content="Trusted Chemistry coaching with topper results, smart notes and personal guidance for Class 11 & 12 students."
  />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Vikram Classes" />
  <meta property="og:image" content="/logo.png" />

  {/* TWITTER */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Vikram Classes – Chemistry Coaching" />
  <meta
    name="twitter:description"
    content="Class 11 & 12 Chemistry coaching with strong fundamentals, exam focus and real results."
  />
  <meta name="twitter:image" content="/logo.png" />

  {/* EXTRA TRUST SIGNALS */}
  <meta name="theme-color" content="#06b6d4" />
  <link rel="canonical" href="https://vikramclasses.com" />
</Head>

      <div className="min-h-screen flex flex-col bg-black text-white scroll-smooth">

        {/* ================= HERO ================= */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm scale-110 brightness-75
            transition-transform duration-[3000ms] motion-safe:animate-[pulse_8s_ease-in-out_infinite]"
            style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/60" />

          {/* TOP RIGHT BUTTONS */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex gap-3">
            <GhostButton
              label="Our Toppers"
              onClick={() =>
                document.getElementById('toppers')?.scrollIntoView({ behavior: 'smooth' })
              }
            />
            <GhostButton
              label="Contact Us"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center
          animate-[fadeInUp_1s_ease-out]">

           {/* LOGO */}
<div className="flex flex-col items-center mb-10">
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative"
  >
    {/* GLOW RING */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      className="absolute inset-0 rounded-full
      bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500
      blur-xl opacity-40"
    />

    {/* FLOATING LOGO */}
    <motion.img
      src="/logo.png"
      alt="Vikram Classes Logo"
      className="relative z-10 w-28 h-28 md:w-40 md:h-40 object-contain"
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.08 }}
    />
  </motion.div>

  {/* TAGLINE */}
  <motion.p
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="mt-4 text-sm sm:text-base tracking-wide
    text-gray-300 text-center"
  >
    <span className="text-cyan-400 font-semibold">Concepts.</span>{" "}
    <span className="text-indigo-400 font-semibold">Clarity.</span>{" "}
    <span className="text-violet-400 font-semibold">Confidence.</span>
  </motion.p>
</div>



            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Vikram Classes
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-gray-300 mb-10 text-sm sm:text-base">
              Class 11 & 12 ke students ke liye
<span className="text-cyan-300">Chemistry mastery program</span> —
jahan concepts bante hain strong,
confidence aata hai natural
aur results follow karte hain consistently.

            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <PremiumButton
                label="Student Register"
                icon={<UserPlus size={18} />}
                onClick={() => router.push('/register')}
                gradient="from-emerald-500 to-teal-500"
              />
              <PremiumButton
                label="Student Login"
                icon={<LogIn size={18} />}
                onClick={() => router.push('/login')}
                gradient="from-sky-500 to-indigo-600"
              />
              <PremiumButton
                label="Admin Login"
                icon={<Lock size={18} />}
                onClick={() => router.push('/admin/login')}
                gradient="from-violet-500 to-pink-600"
              />
            </div>
          </div>
        </section>

{/* ================= FEATURES ================= */}
<section className="py-28 px-6 bg-gradient-to-b from-black to-slate-900">
  <div className="max-w-7xl mx-auto text-center mb-20">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-4xl md:text-5xl font-extrabold mb-5"
    >
      <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        Why Students Trust Vikram Classes
      </span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-gray-400 max-w-2xl mx-auto"
    >
      Result-oriented coaching jahan concepts clear hote hain,
      confidence build hota hai aur performance improve hoti hai.
    </motion.p>
  </div>

  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
    <Feature
      icon={<BookOpen size={40} />}
      title="Structured Notes"
      desc="Scientifically designed notes jo complex chemistry ko
      easy, logical aur exam-ready banate hain."
      color="cyan"
      delay={0}
    />

    <Feature
      icon={<BarChart3 size={40} />}
      title="Performance Tracking"
      desc="Weekly tests, analytics aur guidance jisse students
      apni real progress clearly dekh paate hain."
      color="indigo"
      delay={0.2}
    />

    <Feature
      icon={<ShieldCheck size={40} />}
      title="Secure Learning Portal"
      desc="Modern digital portal jahan learning, notes aur
      communication sab safe & organized rehta hai."
      color="emerald"
      delay={0.4}
    />
  </div>
</section>


        {/* ================= TOPPERS ================= */}
        {/* ================= TOPPERS ================= */}
<section
  id="toppers"
  className="relative py-32 px-6 bg-gradient-to-b from-slate-900 to-black overflow-hidden"
>
  {/* background glow */}
  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[120px]" />

  <div className="relative max-w-7xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center text-4xl md:text-5xl font-extrabold mb-6"
    >
      <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        Our Achievers
      </span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-center text-gray-400 max-w-2xl mx-auto mb-20"
    >
      Real students. Real results. Consistent excellence in Class 11 & 12
      Chemistry.
    </motion.p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
      <TopperCard
        img="/toppers/neha.png"
        name="Neha Bisht"
        year="2024"
        marks="99/100"
        delay={0}
      />
      <TopperCard
        img="/toppers/komal.png"
        name="Komal Bhatt"
        year="2024"
        marks="95/100"
        delay={0.1}
      />
      <TopperCard
        img="/toppers/Mahaveer.png"
        name="Mahaveer Gour"
        year="2023"
        marks="91/100"
        delay={0.2}
      />
      <TopperCard
        img="/toppers/harshit.png"
        name="Harshit Singh"
        year="2023"
        marks="88/100"
        delay={0.3}
      />
    </div>
  </div>
</section>


        {/* ================= CONTACT ================= */}
        {/* ================= CONTACT ================= */}
<section
  id="contact"
  className="relative py-32 px-6 bg-gradient-to-b from-black to-slate-900 overflow-hidden"
>
  {/* glow */}
  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[130px]" />

  <div className="relative max-w-6xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center text-4xl md:text-5xl font-extrabold mb-6"
    >
      <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        Get In Touch
      </span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-center text-gray-400 max-w-2xl mx-auto mb-20"
    >
      Personal guidance, clear communication & dedicated academic support.
    </motion.p>

    <div className="grid md:grid-cols-2 gap-12">
      <ContactCard
        role="Chemistry Mentor"
        name="Mr. Vikram Singh Rawat"
        phone="9557943342"
        emails={["vikramsinghrawat86@gmail.com"]}
        delay={0}
      />

      <ContactCard
        role="System Architect & Developer"
        name="Mr. Sudhanshu Joshi"
        phone="7900431779"
        emails={[
          "sudhanshu24r@gmail.com",
        ]}
        delay={0.2}
      />
    </div>
  </div>
</section>


        <footer className="py-6 text-center text-gray-400 text-sm border-t border-white/10">
          © {new Date().getFullYear()} Vikram Classes • Building Chemistry, Building Futures
        </footer>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function PremiumButton({
  label,
  icon,
  onClick,
  gradient,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      animate="rest"
      variants={{
        rest: { y: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" },
        hover: { y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" },
        tap: { y: 2, boxShadow: "0 6px 20px rgba(0,0,0,0.5)" },
      }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`relative overflow-hidden px-9 py-3.5 rounded-2xl
      bg-gradient-to-r ${gradient} text-white font-semibold`}
    >
      {/* flowing light */}
      <motion.span
        variants={{
          rest: { x: "-120%" },
          hover: { x: "120%" },
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r
        from-transparent via-white/25 to-transparent"
      />

      {/* content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </motion.button>
  );
}



function Feature({ icon, title, desc, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -12, scale: 1.04 }}
      className={`relative group rounded-3xl p-10 text-center
      bg-white/5 border border-white/10 overflow-hidden`}
    >
      {/* GLOW LAYER */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100
        transition duration-500 blur-2xl
        bg-${color}-500/15`}
      />

      {/* ICON */}
      <motion.div
        whileHover={{ rotate: 6, scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`relative z-10 w-20 h-20 mx-auto mb-7
        rounded-2xl flex items-center justify-center
        bg-${color}-500/10 text-${color}-400`}
      >
        {icon}
      </motion.div>

      {/* TEXT */}
      <h3 className="relative z-10 text-xl font-bold mb-4">
        {title}
      </h3>

      <p className="relative z-10 text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}



function TopperCard({ img, name, year, marks, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -14, scale: 1.05 }}
      className="relative group rounded-3xl p-8 text-center
      bg-white/10 border border-white/20 backdrop-blur-xl
      shadow-[0_0_40px_rgba(0,255,255,0.05)]"
    >
      {/* glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
        transition duration-500 blur-2xl
        bg-gradient-to-br from-cyan-400/20 to-indigo-500/20"
      />

      {/* image */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 250 }}
        className="relative z-10 w-28 h-28 mx-auto mb-6 rounded-full
        overflow-hidden ring-2 ring-cyan-400/40"
      >
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* text */}
      <h3 className="relative z-10 font-bold text-lg mb-1">{name}</h3>
      <p className="relative z-10 text-sm text-gray-400">{year}</p>
      <p className="relative z-10 mt-3 text-cyan-400 font-semibold">
        {marks}
      </p>
    </motion.div>
  );
}


function ContactCard({ role, name, phone, emails, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="relative group rounded-3xl p-10
      bg-white/10 backdrop-blur-xl border border-white/20
      shadow-[0_0_40px_rgba(99,102,241,0.15)]"
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
      transition blur-2xl bg-gradient-to-br from-indigo-400/20 to-cyan-400/20" />

      <p className="relative z-10 text-xs uppercase tracking-widest text-cyan-400 mb-6">
        {role}
      </p>

      <p className="relative z-10 flex items-center gap-3 text-lg font-bold mb-5">
        <User className="text-cyan-400" />
        {name}
      </p>

      <p className="relative z-10 flex items-center gap-3 mb-4">
        <Phone className="text-green-400" />
        <a href={`tel:${phone}`} className="hover:underline">
          {phone}
        </a>
      </p>

      {emails.map((e: string, i: number) => (
        <p key={i} className="relative z-10 flex items-center gap-3 text-sm mb-2">
          <Mail className="text-indigo-400" />
          <a href={`mailto:${e}`} className="hover:underline break-all">
            {e}
          </a>
        </p>
      ))}
    </motion.div>
  );
}

