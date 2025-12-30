import jwt from 'jsonwebtoken';

export function getStudentFromToken(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) throw new Error('No token');

  const token = auth.split(' ')[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as {
    id: number;
    name: string;
    email: string;
  };

  return decoded;
}
