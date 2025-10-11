'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import PageTitle from '@/components/PageTitle';
import { addToCartAPI } from '@/lib/features/cart/cartSlice';
import { clearWishlistAPI } from '@/lib/features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const { items: wishlistedIds } = useSelector(state => state.wishlist);
    const { list: allProducts } = useSelector(state => state.product);

    const wishlistedProducts = allProducts.filter(product => wishlistedIds.includes(product.id));

    const handleAddAllToCart = async () => {
        if (wishlistedProducts.length === 0) return;
        
        const addToCartPromises = wishlistedProducts.map(item => dispatch(addToCartAPI({
            productId: item.id,
            color: item.variants?.[0]?.color,
            size: item.variants?.[0]?.size,
        })));

        try {
            await toast.promise(
                Promise.all(addToCartPromises),
                {
                    loading: 'Adding items to cart...',
                    success: `${wishlistedProducts.length} items added to your cart!`,
                    error: 'Could not add all items. Please try again.',
                }
            );
            
            // If all items are added successfully, then clear the wishlist
            await dispatch(clearWishlistAPI()).unwrap();
            toast.success('Wishlist cleared!');

        } catch (error) {
            // Error handling is managed by toast.promise
        }
    };

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto my-10">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <PageTitle
                        heading="My Wishlist"
                        text={`${wishlistedProducts.length} items saved`}
                    />
                    {wishlistedProducts.length > 0 && (
                        <button
                            onClick={handleAddAllToCart}
                            className="flex items-center justify-center gap-2 bg-indigo-500 text-white font-medium py-3 px-6 rounded-md hover:bg-indigo-600 transition-transform active:scale-95"
                        >
                            <ShoppingCart size={20} />
                            Add All to Cart
                        </button>
                    )}
                </div>

                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto mb-32">
                        {wishlistedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-xl text-slate-600">Your wishlist is empty.</h2>
                        <p className="text-slate-500 mt-2">Find something you like and click the heart to save it!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;