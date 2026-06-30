'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';

export default function NotesPage() {
  const params = useParams();
  const className = params.className as string;

  const [medium, setMedium] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingChapters, setFetchingChapters] = useState(false);

  // Get student ID from localStorage (ya session se)
  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      const student = JSON.parse(storedStudent);
      setStudentId(student.id);
    }
    setLoading(false);
  }, []);

  // Fetch chapters when medium and subject are selected
  useEffect(() => {
    if (medium && subject) {
      fetchChapters();
    }
  }, [medium, subject, className]);

  const fetchChapters = async () => {
    setFetchingChapters(true);
    try {
      const res = await fetch(`/api/notes?medium=${medium}&class=${className}&subject=${subject}`);
      const data = await res.json();
      
      if (data.success) {
        setChapters(data.chapters);
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters([]);
    } finally {
      setFetchingChapters(false);
    }
  };

  const accessChapter = async (chapter: any) => {
    if (!studentId) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('/api/notes/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          medium,
          className,
          subject,
          chapterId: chapter.id,
        }),
      });

      const data = await res.json();

      if (data.requiresPayment) {
        // Show payment modal
        setSelectedChapter(chapter);
        setShowPayment(true);
        return;
      }

      if (data.success) {
        // Open PDF in new tab
        window.open(data.note.url, '_blank');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error accessing chapter:', error);
      alert('Failed to access notes');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {className} Notes
        </h1>

        {/* Medium Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Medium
          </label>
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Medium</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="marathi">Marathi</option>
          </select>
        </div>

        {/* Subject Selection */}
        {medium && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="mathematics">Mathematics</option>
              <option value="biology">Biology</option>
            </select>
          </div>
        )}

        {/* Chapters List */}
        {medium && subject && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Chapters - {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </h2>

            {fetchingChapters ? (
              <div className="text-center py-8">Loading chapters...</div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No chapters available
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter: any) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                    onClick={() => accessChapter(chapter)}
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {chapter.chapter_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click to view notes
                    </p>
                    <div className="mt-3 text-xs text-blue-600">
                      ₹3 for 3 months access
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && studentId && selectedChapter && (
          <PaymentModal
            studentId={studentId}
            medium={medium}
            className={className}
            subject={subject}
            onSuccess={() => {
              setShowPayment(false);
              setSelectedChapter(null);
              // Optionally refresh chapters or reload page
            }}
            onClose={() => {
              setShowPayment(false);
              setSelectedChapter(null);
            }}
          />
        )}
      </div>
    </div>
  );
}