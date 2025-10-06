import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import Cart from '@/app/src/db/models/cart';
import Wishlist from '@/app/src/db/models/wishlist';
import User from '@/app/src/db/models/User';

export async function POST(req) {
    try {
        
        const { email, password, firstName, lastName, mobile } = await req.json();

        // Create the Firebase user
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        // Create the user in your PostgreSQL database
        const newUser = await User.create({
            id: userRecord.uid,
            firstName,
            lastName,
            email,
            mobile
        });
        
        // Create a cart and wishlist for the new user
        await Cart.create({ userId: userRecord.uid });
        await Wishlist.create({ userId: userRecord.uid });

        return NextResponse.json({ uid: userRecord.uid }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}