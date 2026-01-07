"use client";

import { useState } from "react";
import {
  UploadCloud,
  BookOpen,
  FileText,
  Layers,
  GraduationCap,
  Book,
  CheckCircle,
} from "lucide-react";

export default function AdminNotesPage() {
  const [medium, setMedium] = useState("");
  const [classNum, setClassNum] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!medium || !classNum || !subject || !chapter || !pdf) {
      alert("❌ Saari details bharna zaroori hai");
      return;
    }

    const fd = new FormData();
    fd.append("medium", medium);
    fd.append("class", classNum);
    fd.append("subject", subject);
    fd.append("chapter", chapter);
    fd.append("pdf", pdf);

    setLoading(true);

    try {
      const res = await fetch("/api/admin/notes/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      alert("✅ Notes uploaded successfully");

      setMedium("");
      setClassNum("");
      setSubject("");
      setChapter("");
      setPdf(null);
    } catch {
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />
          <h1 className="relative text-3xl font-extrabold flex items-center gap-3">
            <BookOpen size={34} /> Upload Study Notes
          </h1>
          <p className="relative text-sm opacity-90 mt-1">
            Admin Panel • Notes Management
          </p>
        </div>

        {/* FORM */}
        <div className="p-6 md:p-10 space-y-6">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <SelectField
              label="Medium"
              icon={<Layers size={18} />}
              value={medium}
              onChange={setMedium}
              options={["Hindi", "English"]}
            />

            <SelectField
              label="Class"
              icon={<GraduationCap size={18} />}
              value={classNum}
              onChange={setClassNum}
              options={["11", "12"]}
              prefix="Class "
            />

            <SelectField
              label="Subject"
              icon={<Book size={18} />}
              value={subject}
              onChange={setSubject}
              options={["Physics", "Chemistry", "Maths", "Biology"]}
            />

            <div>
              <label className="text-sm font-semibold">Chapter Name</label>
              <input
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Thermodynamics"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* PDF */}
          <div>
            <label className="text-sm font-semibold">Upload PDF Notes</label>

            <label
              className={`mt-2 flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-2xl p-8 cursor-pointer transition
              ${
                pdf
                  ? "border-green-400 bg-green-50"
                  : "border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              {pdf ? (
                <>
                  <CheckCircle size={42} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium break-all">
                    {pdf.name}
                  </span>
                </>
              ) : (
                <>
                  <FileText size={42} className="text-indigo-600" />
                  <span className="text-sm text-gray-600">
                    Click to upload PDF file
                  </span>
                </>
              )}

              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* BUTTON */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            text-white py-4 rounded-xl font-semibold text-lg
            shadow-xl transition disabled:opacity-60
            flex items-center justify-center gap-3"
          >
            <UploadCloud size={22} />
            {loading ? "Uploading Notes..." : "Upload Notes"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* ================= SELECT FIELD ================= */

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
  prefix = "",
}: any) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="relative mt-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {prefix}{opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
