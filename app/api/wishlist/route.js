import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';

// Utility function to get or create a wishlist for a user
const getOrCreateWishlist = async (db, userId) => {
    const [wishlist] = await db.Wishlist.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId }
    });
    return wishlist;
};

/**
 * @route   GET /api/wishlist
 * @desc    Get all items in the logged-in user's wishlist
 * @access  Private
 */
const getWishlistHandler = async (req) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;

        const wishlist = await db.Wishlist.findOne({
            where: { user_id: userId },
            include: [{
                model: db.WishlistItem,
                as: 'items',
                include: [{
                    model: db.Product,
                    as: 'product'
                }]
            }]
        });

        if (!wishlist) {
            return NextResponse.json([]);
        }

        // Return just the products for simplicity on the frontend
        const products = wishlist.items.map(item => item.product);
        return NextResponse.json(products);

    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist.' }, { status: 500 });
    }
};

/**
 * @route   POST /api/wishlist
 * @desc    Toggle a product in the user's wishlist (add if not present, remove if present)
 * @access  Private
 */
const toggleWishlistHandler = async (req) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
        }

        const wishlist = await getOrCreateWishlist(db, userId);

        const [wishlistItem, created] = await db.WishlistItem.findOrCreate({
            where: {
                wishlist_id: wishlist.id,
                product_id: productId
            },
            defaults: {
                wishlist_id: wishlist.id,
                product_id: productId
            }
        });

        if (created) {
            return NextResponse.json({ message: 'Product added to wishlist.', action: 'added', productId });
        } else {
            await wishlistItem.destroy();
            return NextResponse.json({ message: 'Product removed from wishlist.', action: 'removed', productId });
        }

    } catch (error) {
        console.error('Error toggling wishlist item:', error);
        return NextResponse.json({ error: 'Failed to update wishlist.' }, { status: 500 });
    }
};

// Wrap handlers with the validation middleware
export const GET = validateUser(getWishlistHandler);
export const POST = validateUser(toggleWishlistHandler);
