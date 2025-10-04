import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
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
            // Also create a cart and wishlist for the new user
            await db.Cart.create({ userId: uid });
            await db.Wishlist.create({ userId: uid });
        } else {
            console.log('Existing user logged in with Google:', user.email);
        }

        // Fetch cart and wishlist counts
        const cart = await db.Cart.findOne({ where: { userId: uid }, include: 'items' });
        const wishlist = await db.Wishlist.findOne({ where: { userId: uid }, include: 'items' });

        const cartCount = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
        const wishlistCount = wishlist ? wishlist.items.length : 0;

        return NextResponse.json({
            success: true,
            user,
            cartCount,
            wishlistCount
        });
    } catch (error) {
        console.error('Error during Google Sign-In user creation:', error);
        return NextResponse.json({ error: 'Failed to process Google Sign-In.' }, { status: 500 });
    }
};