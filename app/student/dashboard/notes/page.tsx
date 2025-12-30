'use client';

import { useEffect, useState } from "react";

interface Chapter {
  id: number;
  chapter_name: string;
  pdf_url: string;
}

interface Book {
  id: number;
  subject: string;
  book_name: string;
  chapters: Chapter[];
}

export default function StudentNotesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Login required");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/student/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("INVALID RESPONSE:", text);
          throw new Error("Server response invalid");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load notes");
        }

        setBooks(data.books || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        📚 Study Notes
      </h1>

      {books.length === 0 && (
        <p className="text-center text-gray-600">
          No notes uploaded yet
        </p>
      )}

      {books.map(book => (
        <div
          key={book.id}
          className="bg-white rounded-xl shadow-md mb-6 p-6"
        >
          <h2 className="text-xl font-bold text-blue-700">
            {book.subject} – {book.book_name}
          </h2>

          {book.chapters.length === 0 ? (
            <p className="text-gray-500 mt-2">
              No chapters available
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {book.chapters.map(ch => (
                <li
                  key={ch.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{ch.chapter_name}</span>

                  <a
                    href={ch.pdf_url}
                    target="_blank"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
