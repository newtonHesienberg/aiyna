import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';
import Wishlist from '@/app/src/db/models/wishlist';
import WishlistItem from '@/app/src/db/models/wishlistitem';
import Product from '@/app/src/db/models/Product';

// Utility function to get or create a wishlist for a user
const getOrCreateWishlist = async (userId) => {
    const [wishlist] = await Wishlist.findOrCreate({
        where: { userId },
        defaults: { userId }
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
        
        const userId = req.user.uid;

        const wishlist = await Wishlist.findOne({
            where: { userId },
            include: [{
                model: WishlistItem,
                as: 'items',
                include: [{
                    model: Product,
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
        
        const userId = req.user.uid;
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
        }

        const wishlist = await getOrCreateWishlist(userId);

        const [wishlistItem, created] = await WishlistItem.findOrCreate({
            where: {
                wishlistId: wishlist.id,
                productId: productId
            },
            defaults: {
                wishlistId: wishlist.id,
                productId: productId
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

/**
 * @route   DELETE /api/wishlist
 * @desc    Clear all items from the user's wishlist
 * @access  Private
 */
const clearWishlistHandler = async (req) => {
    try {
        
        const userId = req.user.uid;

        const wishlist = await Wishlist.findOne({ where: { userId } });

        if (wishlist) {
            await WishlistItem.destroy({ where: { wishlistId: wishlist.id } });
        }

        return NextResponse.json({ message: 'Wishlist cleared successfully.' });
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        return NextResponse.json({ error: 'Failed to clear wishlist.' }, { status: 500 });
    }
};

// Wrap handlers with the validation middleware
export const GET = validateUser(getWishlistHandler);
export const POST = validateUser(toggleWishlistHandler);
export const DELETE = validateUser(clearWishlistHandler);