'use client';

import { useState } from 'react';
import { BookOpen, UploadCloud } from 'lucide-react';

export default function UploadPYQ() {
  const [medium, setMedium] = useState('');
  const [cls, setCls] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const uploadPYQ = async () => {
    if (!file) return alert('PDF select karo');

    const formData = new FormData();
    formData.append('medium', medium);
    formData.append('class', cls);
    formData.append('subject', subject);
    formData.append('pdf', file);

    await fetch('/api/admin/pyq', {
      method: 'POST',
      body: formData,
    });

    alert('PYQ Uploaded Successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen /> Upload PYQ
          </h1>
          <p className="text-indigo-100 mt-1">Admin Panel · PYQ Management</p>
        </div>

        {/* FORM */}
        <div className="p-8 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              className="input"
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="">Select Medium</option>
              <option>English</option>
              <option>Hindi</option>
            </select>

            <select
              className="input"
              onChange={(e) => setCls(e.target.value)}
            >
              <option value="">Select Class</option>
              <option>11</option>
              <option>12</option>
            </select>
          </div>

          {/* ROW 2 */}
          <select
            className="input"
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>

          {/* FILE UPLOAD */}
          <label className="border-2 border-dashed border-indigo-400 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition">
            <UploadCloud className="w-10 h-10 text-indigo-600 mb-2" />
            <p className="text-gray-600">
              {file ? file.name : 'Click to upload PDF file'}
            </p>
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* BUTTON */}
          <button
            onClick={uploadPYQ}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90"
          >
            <UploadCloud /> Upload PYQ
          </button>
        </div>
      </div>
    </div>
  );
}
