import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

const validateUser = (handler) => async (req) => {
  const authorization = req.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      return handler(req);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
};

export default validateUser;