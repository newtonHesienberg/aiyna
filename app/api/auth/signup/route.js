import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import dbPromise from '@/app/src/db/models';

export async function POST(req) {
    try {
        const db = await dbPromise;
        const { email, password, firstName, lastName, mobile } = await req.json();

        // Create the Firebase user
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        // Create the user in your PostgreSQL database
        const newUser = await db.User.create({
            id: userRecord.uid,
            firstName,
            lastName,
            email,
            mobile
        });
        
        // Create a cart and wishlist for the new user
        await db.Cart.create({ userId: userRecord.uid });
        await db.Wishlist.create({ userId: userRecord.uid });

        return NextResponse.json({ uid: userRecord.uid }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}