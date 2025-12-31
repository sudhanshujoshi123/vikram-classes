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
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/chemistry-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

        {/* TOP RIGHT BUTTONS */}
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          <button
            onClick={() =>
              document.getElementById('toppers')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
          >
            Our Toppers
          </button>
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
          >
            Contact
          </button>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">

          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <img
              src="/logo.png"
              alt="Vikram Classes Logo"
              className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]"
            />
          </div>

          <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold mb-6">
            Swati Classes
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-200 mb-12">
            Premium chemistry-focused learning platform for Class 11 & 12.
            Smart notes, performance tracking and personal mentoring.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <MainButton
              label="Student Register"
              icon={<UserPlus size={18} />}
              onClick={() => router.push('/register')}
              gradient="from-green-500 to-emerald-600"
            />
            <MainButton
              label="Student Login"
              icon={<LogIn size={18} />}
              onClick={() => router.push('/login')}
              gradient="from-blue-500 to-indigo-600"
            />
            <MainButton
              label="Admin Login"
              icon={<Lock size={18} />}
              onClick={() => router.push('/admin/login')}
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <Feature
            icon={<BookOpen size={40} />}
            title="Structured Chemistry Notes"
            desc="Chapter-wise PDFs for Class 11 & 12."
          />
          <Feature
            icon={<BarChart3 size={40} />}
            title="Performance Tracking"
            desc="Marks, progress & insights."
          />
          <Feature
            icon={<ShieldCheck size={40} />}
            title="Secure Portal"
            desc="JWT based student & admin login."
          />
        </div>
      </section>

      {/* ================= TOPPERS ================= */}
      <section id="toppers" className="py-24 px-6 bg-black">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Our Star Toppers
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
            img="/toppers/mahaveer.png"
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
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-black to-slate-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Contact & Support
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <ContactCard
            role="Teacher"
            name="Mr. Vikram Singh Rawat"
            phone="9557943342"
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
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black border-t border-white/10 py-8 text-center text-sm text-gray-400">
        <p className="text-white font-semibold">Vikram Classes</p>
        <p className="opacity-70">© {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MainButton({ label, icon, onClick, gradient }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r ${gradient}
      font-semibold shadow-xl hover:scale-105 transition`}
    >
      {icon}
      {label}
    </button>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 text-center shadow-xl">
      <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}

function TopperCard({ img, name, year, marks }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 text-center shadow-xl hover:-translate-y-2 transition">
      <img
        src={img}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-contain bg-black/30 p-2 mb-4"
      />
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-gray-400">Year {year}</p>
      <p className="mt-2 text-cyan-300 font-semibold">
        Chemistry {marks}
      </p>
    </div>
  );
}

function ContactCard({ role, name, phone, emails }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
      <p className="text-xs uppercase tracking-widest text-cyan-300 mb-4">{role}</p>

      <div className="flex items-center gap-3 mb-4">
        <User className="text-cyan-400" />
        <span className="font-bold">{name}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-green-400" />
        <span>{phone}</span>
      </div>

      {emails?.map((e: string, i: number) => (
        <div key={i} className="flex items-center gap-3 mb-2">
          <Mail className="text-purple-400" />
          <span className="text-sm break-all">{e}</span>
        </div>
      ))}
    </div>
  );
}
