import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const result = await pool.query('SELECT * FROM teachers WHERE email=$1', [email]);
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Admin login successful', user: { id: user.id, name: user.name, email: user.email } });
}
