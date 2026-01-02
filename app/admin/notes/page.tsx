"use client";

import { useState } from "react";
import { UploadCloud, BookOpen, FileText } from "lucide-react";

export default function AdminNotesPage() {
  const [medium, setMedium] = useState("");
  const [classNum, setClassNum] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!medium || !classNum || !subject || !chapter || !pdf) {
      alert("Saari fields bharo ❌");
      return;
    }

    const fd = new FormData();
    fd.append("medium", medium);
    fd.append("class", classNum);
    fd.append("subject", subject);
    fd.append("chapter", chapter);
    fd.append("pdf", pdf);

    setLoading(true);

    const res = await fetch("/api/admin/notes/upload", {
      method: "POST",
      body: fd,
    });

    setLoading(false);

    if (!res.ok) {
      alert("Upload failed ❌");
    } else {
      alert("Notes uploaded successfully ✅");
      setMedium("");
      setClassNum("");
      setSubject("");
      setChapter("");
      setPdf(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <BookOpen /> Upload Notes
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Admin Panel • Hindi / English Medium
          </p>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">

          {/* MEDIUM */}
          <div>
            <label className="text-sm font-semibold">Medium</label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Medium</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* CLASS */}
          <div>
            <label className="text-sm font-semibold">Class</label>
            <select
              value={classNum}
              onChange={(e) => setClassNum(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Class</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-sm font-semibold">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Chemistry"
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* CHAPTER */}
          <div>
            <label className="text-sm font-semibold">Chapter Name</label>
            <input
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Mole Concept"
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* PDF */}
          <div>
            <label className="text-sm font-semibold">Upload PDF</label>

            <label className="mt-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer hover:bg-indigo-50 transition">
              <FileText className="text-indigo-500" size={36} />
              <span className="text-sm text-gray-600">
                {pdf ? pdf.name : "Click to upload PDF"}
              </span>
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
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <UploadCloud />
            {loading ? "Uploading..." : "Upload Notes"}
          </button>

        </div>
      </div>
    </div>
  );
}
