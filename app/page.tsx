
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

        {/* BACKGROUND (blurred) */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-[4px] scale-[1.03] brightness-[0.78]"
          style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* Dark overlay + backdrop blur for extra softness */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" aria-hidden="true" />

        {/* TOP RIGHT BUTTONS */}
        <div className="absolute top-5 right-5 z-20 flex gap-3">
          <GhostButton
            label="Our Toppers"
            onClick={() =>
              document.getElementById('toppers')?.scrollIntoView({ behavior: 'smooth' })
            }
          />
          <GhostButton
            label="Contact"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">

          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Vikram Classes Logo"
                className="w-28 h-28 md:w-36 md:h-36 object-contain"
              />
              {/* subtle glow */}
              <span className="absolute inset-0 rounded-xl blur-2xl opacity-30 bg-cyan-500/40 -z-10" />
            </div>
          </div>

          {/* NEW TEXT (fresh, crisp) */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Vikram Classes
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-200/90 mb-6">
            Class 11 &amp; 12 ke liye <span className="text-cyan-300">Chemistry</span> ka
            focussed learning hub — clear concepts, smart notes &amp; personal mentoring.
          </p>
          <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-400 mb-10">
            Humara goal simple hai: <span className="text-white/90">clarity</span>, <span className="text-white/90">consistency</span> aur
            <span className="text-white/90"> confidence</span> — taaki boards &amp; competitive exams me strong results aaye.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <MainButton
              label="Student Register"
              icon={<UserPlus size={18} />}
              onClick={() => router.push('/register')}
              gradient="from-emerald-500 to-teal-500"
            />
            <MainButton
              label="Student Login"
              icon={<LogIn size={18} />}
              onClick={() => router.push('/login')}
              gradient="from-sky-500 to-indigo-600"
            />
            <MainButton
              label="Admin Login"
              icon={<Lock size={18} />}
              onClick={() => router.push('/admin/login')}
              gradient="from-violet-500 to-pink-600"
            />
          </div>

          {/* Divider */}
          <div className="pointer-events-none select-none mt-12 mx-auto h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              What You Get
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<BookOpen size={38} />}
              title="Structured Notes"
              desc="Chapter-wise PDFs, crisp summaries & exam-oriented highlights."
            />
            <Feature
              icon={<BarChart3 size={38} />}
              title="Performance Insights"
              desc="Marks tracking, progress trends & actionable feedback."
            />
            <Feature
              icon={<ShieldCheck size={38} />}
              title="Secure Portal"
              desc="JWT-based login for students & admins with role control."
            />
          </div>
        </div>
      </section>

      {/* ================= TOPPERS ================= */}
      <section id="toppers" className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
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
      <section id="contact" className="py-20 px-6 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Contact & Support
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                "sudhanshu24r@gmail.com",
                "sudhanshu.system@nainigroup.com",
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
      hover:scale-[1.03] active:scale-[0.99] focus:outline-none ring-1 ring-white/10`}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-white" />
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
      backdrop-blur-md border border-white/10 transition shadow-md"
    >
      {label}
    </button>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div
      className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl
      hover:-translate-y-1 transition border border-white/10"
    >
      <div className="mx-auto mb-6 w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-indigo-500/25
      flex items-center justify-center text-cyan-300 ring-1 ring-white/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 tracking-wide">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TopperCard({ img, name, year, marks }: any) {
  return (
    <div
      className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 text-center shadow-xl
      hover:-translate-y-1.5 transition border border-white/10"
    >
      <img
        src={img}
        alt={name}
        className="w-28 h-28 mx-auto rounded-full object-contain bg-black/30 p-2 mb-4"
      />
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-gray-400">Year {year}</p>
      <p className="mt-2 text-cyan-300 font-semibold">Chemistry {marks}</p>
    </div>
  );
}

function ContactCard({ role, name, phone, emails }: any) {
  return (
    <div
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl
      hover:-translate-y-1 transition"
    >
      <p className="text-xs uppercase tracking-widest text-cyan-300 mb-4">{role}</p>

      <div className="flex items-center gap-3 mb-4">
        <User className="text-cyan-400" />
        <span className="font-bold">{name}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-green-400" />
        <a href={`tel:${phone}`} className="hover:underline underline-offset-4">
          {phone}
        </a>
      </div>

      {emails?.map((e: string, i: number) => (
        <div key={i} className="flex items-center gap-3 mb-2">
          <Mail className="text-purple-400" />
          <a href={`mailto:${e}`} className="text-sm break-all hover:underline underline-offset-4">
            {e}
          </a>
        </div>
      ))}
    </div>
  );
}
