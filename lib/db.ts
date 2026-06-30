import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const pool = new Pool({
  connectionString,
});

// ============================================
// SUBSCRIPTION FUNCTIONS
// ============================================

// Check if student has active subscription for a class
export async function checkSubscription(studentId: number, className: string) {
  const result = await pool.query(
    `SELECT * FROM subscriptions 
     WHERE student_id = $1 
     AND class_name = $2
     AND is_active = true
     AND expires_at > NOW()
     ORDER BY expires_at DESC
     LIMIT 1`,
    [studentId, className]
  );
  
  return result.rows[0] || null;
}

// Create new subscription (3 months validity)
export async function createSubscription(studentId: number, className: string, months: number = 3) {
  const result = await pool.query(
    `INSERT INTO subscriptions (student_id, class_name, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '${months} months')
     RETURNING *`,
    [studentId, className]
  );
  
  return result.rows[0];
}

// Extend existing subscription
export async function extendSubscription(subscriptionId: number, months: number = 3) {
  const result = await pool.query(
    `UPDATE subscriptions 
     SET expires_at = expires_at + INTERVAL '${months} months',
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [subscriptionId]
  );
  
  return result.rows[0];
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

// Create new payment request
export async function createPaymentRequest(
  studentId: number, 
  className: string, 
  utrNumber: string, 
  amount: number
) {
  const result = await pool.query(
    `INSERT INTO payments (student_id, class_name, utr_number, amount, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [studentId, className, utrNumber, amount]
  );
  
  return result.rows[0];
}

// Get payment by UTR number
export async function getPaymentByUTR(utrNumber: string) {
  const result = await pool.query(
    `SELECT * FROM payments WHERE utr_number = $1`,
    [utrNumber]
  );
  
  return result.rows[0] || null;
}

// Get all pending payments (for admin)
export async function getPendingPayments() {
  const result = await pool.query(
    `SELECT p.*, s.name as student_name, s.email, s.student_class
     FROM payments p
     JOIN students s ON p.student_id = s.id
     WHERE p.status = 'pending'
     ORDER BY p.created_at DESC`
  );
  
  return result.rows;
}

// Get payment by ID
export async function getPaymentById(paymentId: number) {
  const result = await pool.query(
    `SELECT p.*, s.name as student_name, s.email, s.student_class
     FROM payments p
     JOIN students s ON p.student_id = s.id
     WHERE p.id = $1`,
    [paymentId]
  );
  
  return result.rows[0] || null;
}

// Update payment status
export async function updatePaymentStatus(paymentId: number, status: string) {
  const result = await pool.query(
    `UPDATE payments 
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, paymentId]
  );
  
  return result.rows[0];
}

// Verify payment and activate subscription (admin function)
export async function verifyPayment(paymentId: number, studentId: number, className: string, months: number = 3) {
  // Start transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Update payment status to completed
    await client.query(
      `UPDATE payments 
       SET status = 'completed', verified_by_admin = true, updated_at = NOW()
       WHERE id = $1`,
      [paymentId]
    );
    
    // 2. Check if student already has active subscription
    const existingSub = await client.query(
      `SELECT * FROM subscriptions 
       WHERE student_id = $1 
       AND class_name = $2
       AND is_active = true
       AND expires_at > NOW()
       ORDER BY expires_at DESC
       LIMIT 1`,
      [studentId, className]
    );
    
    let subscription;
    
    if (existingSub.rows.length > 0) {
      // Extend existing subscription
      const result = await client.query(
        `UPDATE subscriptions 
         SET expires_at = expires_at + INTERVAL '${months} months',
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [existingSub.rows[0].id]
      );
      subscription = result.rows[0];
    } else {
      // Create new subscription
      const result = await client.query(
        `INSERT INTO subscriptions (student_id, class_name, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '${months} months')
         RETURNING *`,
        [studentId, className]
      );
      subscription = result.rows[0];
    }
    
    await client.query('COMMIT');
    return subscription;
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Reject payment (admin function)
export async function rejectPayment(paymentId: number) {
  const result = await pool.query(
    `UPDATE payments 
     SET status = 'rejected', verified_by_admin = false, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [paymentId]
  );
  
  return result.rows[0];
}

// Get all subscriptions for a student
export async function getStudentSubscriptions(studentId: number) {
  const result = await pool.query(
    `SELECT * FROM subscriptions 
     WHERE student_id = $1
     ORDER BY created_at DESC`,
    [studentId]
  );
  
  return result.rows;
}