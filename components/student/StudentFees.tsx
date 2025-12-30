'use client';

import { useEffect, useState } from "react";

export default function StudentFees() {
  const [totalFees, setTotalFees] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) {
      console.error("Student ID not found");
      setLoading(false);
      return;
    }

    fetch("/api/student/fees", {
      headers: {
        "x-student-id": studentId,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTotalFees(data.total_paid);
      })
      .catch((err) => {
        console.error("Fees error:", err);
        setTotalFees(0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">💰 Fees</h2>

      <div className="p-4 bg-green-50 rounded-lg text-lg font-bold">
        {loading
          ? "Loading fees..."
          : `Total Paid Fees: ₹${totalFees}`}
      </div>
    </div>
  );
}
