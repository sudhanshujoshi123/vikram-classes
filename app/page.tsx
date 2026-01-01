
'use client';

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

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-500/30 selection:text-white">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 brightness-90"
          style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* Overlay + subtle pattern */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_25%_25%,rgba(34,211,238,0.25)_0,transparent_35%),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.18)_0,transparent_40%)]"
          aria-hidden="true"
        />

        {/* TOP RIGHT BUTTONS */}
        <div className="absolute top-5 right-5 z-20 flex gap-3">
          <GhostButton
            onClick={() =>
              document.getElementById('toppers')?.scrollIntoView({ behavior: 'smooth' })
            }
            label="Our Toppers"
          />
          <GhostButton
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            label="Contact"
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">

          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Vikram Classes Logo"
                className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]"
              />
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-full blur-3xl opacity-40 bg-cyan-500/30 -z-10" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Vikram Classes
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-200 mb-12">
            Premium chemistry-focused learning platform for Class 11 &amp; 12. <br className="hidden sm:block" />
            Smart notes, performance tracking and personal mentoring.
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <MainButton
              label="Student Register"
              icon={<UserPlus size={18} />}
              onClick={() => router.push('/register')}
              gradient="from-emerald-500 via-green-500 to-teal-500"
            />
            <MainButton
              label="Student Login"
              icon={<LogIn size={18} />}
              onClick={() => router.push('/login')}
              gradient="from-sky-500 via-blue-500 to-indigo-600"
            />
            <MainButton
              label="Admin Login"
              icon={<Lock size={18} />}
              onClick={() => router.push('/admin/login')}
              gradient="from-violet-500 via-fuchsia-500 to-pink-600"
            />
          </div>

          {/* Decorative bottom fade */}
          <div className="pointer-events-none select-none mt-16 mx-auto h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-slate-900 relative">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.15)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.1)_95%)] bg-[size:24px_24px]"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <Feature
            icon={<BookOpen size={40} />}
            title="Structured Chemistry Notes"
            desc="Chapter-wise PDFs for Class 11 & 12 with crisp summaries."
          />
          <Feature
            icon={<BarChart3 size={40} />}
            title="Performance Tracking"
            desc="Marks, progress & insights with trend visuals."
          />
          <Feature
            icon={<ShieldCheck size={40} />}
            title="Secure Portal"
            desc="JWT-based student & admin login with role control."
          />
        </div>
      </section>

      {/* ================= TOPPERS ================= */}
      <section id="toppers" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Our Star Toppers
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TopperCard
              img="/toppers/neha.png"
              name="Neha Bisht"
              year="2024"
              marks="99 / 100"
            />
            <TopperCard
              img="/toppers/komal.png"
              name="Komal Bhatt"
              year="2024"
              marks="95 / 100"
            />
            <TopperCard
              img="/toppers/Mahaveer.png"
              name="Mahaveer Gour"
              year="2023"
              marks="91 / 100"
            />
            <TopperCard
              img="/toppers/harshit.png"
              name="Harshit Singh"
              year="2023"
              marks="88 / 100"
            />
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Contact & Support
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ContactCard
              role="Teacher"
              name="Mr. Vikram Singh Rawat"
              phone="9557943342"
              emails={["vikramsinghrawat86@gmail.com"]}
            />
            <ContactCard
              role="Website Designer & System Architect"
              name="Mr. Sudhanshu Joshi"
              phone="7900431779"
              emails={[
                'sudhanshu24r@gmail.com',
                'sudhanshu.system@nainigroup.com',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black border-t border-white/10 py-10 text-center text-sm text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-semibold tracking-wide">Vikram Classes</p>
          <p className="opacity-70">© {new Date().getFullYear()} All Rights Reserved</p>
          {/* social line */}
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mt-2" />
        </div>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MainButton({ label, icon, onClick, gradient }: any) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden flex items-center gap-2 px-8 py-3 rounded-xl
      bg-gradient-to-r ${gradient} font-semibold shadow-xl transition
      hover:scale-[1.03] focus:scale-[1.02] active:scale-[0.99] focus:outline-none
      ring-1 ring-white/10`}
    >
      {/* inner glow */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-white" />
      <span className="relative flex items-center gap-2">
        <span className="grid place-items-center">{icon}</span>
        <span>{label}</span>
      </span>
    </button>
  );
}

function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-white/90
      backdrop-blur-md border border-white/10 transition shadow-md hover:shadow-lg"
    >
      {label}
    </button>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div
      className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-10 text-center shadow-xl
      hover:-translate-y-1.5 transition border border-white/10"
    >
      {/* glow accent */}
      <span className="absolute -top-1 -right-1 h-20 w-20 rounded-full blur-2xl bg-cyan-500/20" aria-hidden="true" />
      <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-indigo-500/25
      flex items-center justify-center text-cyan-300 ring-1 ring-white/20 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-wide">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TopperCard({ img, name, year, marks }: any) {
  return (
    <div
      className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 text-center shadow-xl
      hover:-translate-y-2 transition border border-white/10 overflow-hidden"
    >
      {/* subtle border glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-3xl ring-1 ring-cyan-400/20" />
      <img
        src={img}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-contain bg-black/30 p-2 mb-4 shadow-md"
      />
      <h3 className="font-bold text-lg tracking-wide">{name}</h3>
      <p className="text-sm text-gray-400">Year {year}</p>
      <p className="mt-2 text-cyan-300 font-semibold">Chemistry {marks}</p>

      {/* decorative line */}
      <div className="mt-4 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </div>
  );
}

function ContactCard({ role, name, phone, emails }: any) {
  return (
    <div
      className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl
      hover:-translate-y-1.5 transition"
    >
      {/* gradient top bar */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-cyan-400/50 via-indigo-400/50 to-pink-400/50" />
      <p className="text-xs uppercase tracking-widest text-cyan-300 mb-4">{role}</p>

      <div className="flex items-center gap-3 mb-4">
        <User className="text-cyan-400" />
        <span className="font-bold">{name}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-green-400" />
        {/* tel link for mobile */}
        <a href={`tel:${phone}`} className="hover:underline underline-offset-4">
          {phone}
        </a>
      </div>

      {emails?.map((e: string, i: number) => (
        <div key={i} className="flex items-center gap-3 mb-2">
          <Mail className="text-purple-400" />
          {/* mailto link */}
          <a href={`mailto:${e}`} className="text-sm break-all hover:underline underline-offset-4">
            {e}
          </a>
        </div>
      ))}
    </div>
  );
}
``
