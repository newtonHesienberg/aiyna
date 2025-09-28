import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req) {
    try {
        const { email, password, firstName, lastName } = await req.json();

        const userRecord = await admin.auth().createUser({
            email,
            password,
            firstName,
            lastName
        });

        return NextResponse.json({ uid: userRecord.uid }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}