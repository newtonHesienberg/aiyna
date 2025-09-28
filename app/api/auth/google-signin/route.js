import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models'; // 1. Import the initializer
import validateUser from '@/app/src/middleware/validateUser';
import { Op } from 'sequelize';

export async function POST(request) {
    try {
        const { uid, email, firstName, lastName, profileImage } = await request.json();
        const db = await dbPromise;
        // Use findOrCreate to prevent creating duplicate users
        const [user, created] = await db.User.findOrCreate({
            where: {
                id: { [Op.eq]: uid }
            },
            defaults: {
                id: uid,
                email,
                firstName,
                lastName,
                profileImage,
                emailVerified: true,
            }
        });

        if (created) {
            console.log('New user created from Google Sign-In:', user.email);
        } else {
            console.log('Existing user logged in with Google:', user.email);
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error during Google Sign-In user creation:', error);
        return NextResponse.json({ error: 'Failed to process Google Sign-In.' }, { status: 500 });
    }
};