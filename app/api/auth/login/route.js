import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import admin from '@/lib/firebaseAdmin';
import Cart from '@/app/src/db/models/cart';
import Wishlist from '@/app/src/db/models/wishlist';
import User from '@/app/src/db/models/User';

export async function POST(request) {
    try {
        const { idToken } = await request.json();
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: uid }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Fetch cart and wishlist counts
        const cart = await Cart.findOne({ where: { userId: uid }, include: 'items' });
        const wishlist = await Wishlist.findOne({ where: { userId: uid }, include: 'items' });

        const cartCount = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
        const wishlistCount = wishlist ? wishlist.items.length : 0;

        return NextResponse.json({
            success: true,
            user,
            cartCount,
            wishlistCount
        });
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'Failed to process login.' }, { status: 500 });
    }
};