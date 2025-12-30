'use client';

import { useEffect, useState } from 'react';

type Note = {
  class: string;
  subject: string;
  book_name: string;
  chapter_name: string;
  pdf_url: string;
};

export default function StudentNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data.notes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading notes...</p>;

  if (notes.length === 0)
    return <p className="text-gray-500">No notes uploaded yet</p>;

  return (
    <div className="space-y-4">
      {notes.map((n, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">
              Class {n.class} – {n.subject}
            </p>
            <p className="text-sm text-gray-600">
              {n.book_name} → {n.chapter_name}
            </p>
          </div>

          <a
            href={n.pdf_url}
            target="_blank"
            className="text-blue-600 font-semibold"
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
}
