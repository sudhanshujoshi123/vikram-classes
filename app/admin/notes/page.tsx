"use client";

import { useState } from "react";
import { UploadCloud, FileText, Languages } from "lucide-react";

export default function NotesUploadPage() {
  const [classNum, setClassNum] = useState("11");
  const [subject] = useState("Chemistry");
  const [medium, setMedium] = useState("English");
  const [chapterName, setChapterName] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!chapterName || !pdf) {
      alert("Saari fields bharo");
      return;
    }

    const formData = new FormData();
    formData.append("class", classNum);
    formData.append("subject", subject);
    formData.append("medium", medium);
    formData.append("chapter_name", chapterName);
    formData.append("pdf", pdf);

    setLoading(true);

    const res = await fetch("/api/admin/notes/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    alert("Notes uploaded successfully ✅");
    setChapterName("");
    setPdf(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <UploadCloud /> Upload Study Notes
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Class 11 & 12 • Chemistry PDFs
          </p>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">

          {/* CLASS */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Select Class
            </label>
            <select
              value={classNum}
              onChange={(e) => setClassNum(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Subject
            </label>
            <input
              value={subject}
              disabled
              className="mt-1 w-full rounded-xl border px-4 py-2 bg-gray-100"
            />
          </div>

          {/* MEDIUM */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Medium
            </label>
            <div className="relative mt-1">
              <Languages className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full rounded-xl border pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          {/* CHAPTER */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Chapter Name
            </label>
            <input
              placeholder="e.g. Mole Concept"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* FILE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Upload PDF
            </label>

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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Notes"}
          </button>

        </div>
      </div>
    </div>
  );
}
