import { NextResponse } from 'next/server';
import validateUser from '@/app/src/middleware/validateUser';
import Cart from '@/app/src/db/models/cart';
import CartItem from '@/app/src/db/models/cartitem';
import Product from '@/app/src/db/models/Product';

// Utility function to get or create a cart for a user
const getOrCreateCart = async (userId) => {
    const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId }
    });
    return cart;
};

/**
 * @route   GET /api/cart
 * @desc    Get all items in the logged-in user's cart
 * @access  Private
 */
const getCartHandler = async (req) => {
    try {
        
        const userId = req.user.uid;

        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!cart) {
            return NextResponse.json([]);
        }

        return NextResponse.json(cart.items || []);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart.' }, { status: 500 });
    }
};

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart or update its quantity
 * @access  Private
 */
const addToCartHandler = async (req) => {
    try {
        
        const userId = req.user.uid;
        const { productId, color, size, quantity = 1 } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
        }

        const cart = await getOrCreateCart(userId);

        const whereClause = {
            cartId: cart.id,
            productId: productId,
            // Handle nulls for products that might not have color/size
            color: color || null,
            size: size || null
        };
        
        let cartItem = await CartItem.findOne({ where: whereClause });

        if (cartItem) {
            // If item exists, update its quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // If item does not exist, create it
            cartItem = await CartItem.create({
                ...whereClause,
                quantity: quantity,
            });
        }
        
        // Refetch with product to return full details
        const itemWithProduct = await CartItem.findByPk(cartItem.id, {
            include: [{model: Product, as: 'product'}]
        });

        return NextResponse.json(itemWithProduct, { status: 200 });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add item to cart.' }, { status: 500 });
    }
};

/**
 * @route   PUT /api/cart
 * @desc    Update an item's quantity in the cart
 * @access  Private
 */
const updateCartItemHandler = async (req) => {
    try {
        
        const userId = req.user.uid;
        const { cartItemId, quantity } = await req.json();

        if (!cartItemId || quantity === undefined) {
            return NextResponse.json({ error: 'Cart Item ID and quantity are required.' }, { status: 400 });
        }
        
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found.' }, { status: 404 });
        }

        const cartItem = await CartItem.findOne({
            where: {
                id: cartItemId,
                cart_id: cart.id
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
        }

        if (quantity <= 0) {
             await cartItem.destroy();
             return NextResponse.json({ message: 'Item removed from cart.' });
        } else {
            cartItem.quantity = quantity;
            await cartItem.save();
             // Refetch with product to return full details
            const itemWithProduct = await CartItem.findByPk(cartItem.id, {
                include: [{model: Product, as: 'product'}]
            });
            return NextResponse.json(itemWithProduct);
        }

    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json({ error: 'Failed to update cart item.' }, { status: 500 });
    }
};

/**
 * @route   DELETE /api/cart
 * @desc    Remove an item from the cart
 * @access  Private
 */
const deleteFromCartHandler = async (req) => {
     try {
        
        const userId = req.user.uid;
        const { searchParams } = new URL(req.url);
        const cartItemId = searchParams.get('cartItemId');

        if (!cartItemId) {
            return NextResponse.json({ error: 'Cart Item ID is required.' }, { status: 400 });
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found.' }, { status: 404 });
        }

        const cartItem = await CartItem.findOne({
            where: {
                id: cartItemId,
                cart_id: cart.id
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
        }

        await cartItem.destroy();

        return NextResponse.json({ message: 'Item successfully removed from cart.' });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        return NextResponse.json({ error: 'Failed to delete item from cart.' }, { status: 500 });
    }
};


// Wrap handlers with the validation middleware
export const GET = validateUser(getCartHandler);
export const POST = validateUser(addToCartHandler);
export const PUT = validateUser(updateCartItemHandler);
export const DELETE = validateUser(deleteFromCartHandler);
