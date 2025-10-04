'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Equal } from 'lucide-react'
import { addToCartAPI } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const FrequentlyBoughtTogether = ({ currentProduct }) => {
    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.product.list);
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    // Recommendation logic: Find two other products from the same category.
    const recommendedProducts = allProducts
        .filter(p => p.id !== currentProduct.id && p.subCategory?.name === currentProduct.subCategory?.name)
        .slice(0, 2);

    // Fallback: If not enough products in the same category, grab any other two.
    if (recommendedProducts.length < 2) {
        const otherProducts = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 2 - recommendedProducts.length);
        recommendedProducts.push(...otherProducts);
    }
    
    const allItems = [currentProduct, ...recommendedProducts];
    const totalPrice = allItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

    const handleAddAllToCart = () => {
        // Create an array of dispatch promises for each item
        const promises = allItems.map(item =>
            dispatch(addToCartAPI({
                productId: item.id,
                color: item.variants?.[0]?.color, // Default to the first color/size if available
                size: item.variants?.[0]?.size,
            }))
        );

        // Use toast.promise to handle the array of API calls
        toast.promise(
            Promise.all(promises),
            {
                loading: 'Adding items to cart...',
                success: `${allItems.length} items added to your cart!`,
                error: 'Could not add all items. Please try again.',
            }
        );
    }

    if (recommendedProducts.length === 0) {
        return null; // Don't render if there are no other products to recommend
    }

    return (
        <div className="my-20">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Frequently Bought Together</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {/* Product Items */}
                <div className="flex items-center gap-4">
                    {allItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <Link href={`/product/${item.id}`} className="flex flex-col items-center gap-2 group">
                                <div className="bg-slate-100 p-4 rounded-lg">
                                    <Image 
                                        src={item.images[0]} 
                                        alt={item.name} 
                                        width={100} 
                                        height={100}
                                        className="w-24 h-24 object-contain group-hover:scale-105 transition"
                                    />
                                </div>
                                <p className="text-sm text-slate-700 truncate w-28 text-center">{item.name}</p>
                                <p className="text-sm font-semibold text-slate-800">{currency}{item.price}</p>
                            </Link>
                            {index < allItems.length - 1 && <Plus className="text-slate-400" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Equal className="text-slate-400 hidden md:block" />
                </div>
                
                {/* Total and Add to Cart */}
                <div className="flex flex-col items-center border border-slate-200 p-6 rounded-lg">
                    <p className="text-sm text-slate-500">Total Price:</p>
                    <p className="text-2xl font-bold text-slate-800 my-2">{currency}{totalPrice.toFixed(2)}</p>
                    <button 
                        onClick={handleAddAllToCart}
                        className="w-full bg-indigo-500 text-white font-medium py-3 px-8 rounded-md hover:bg-indigo-600 transition-transform active:scale-95 mt-2"
                    >
                        Add All To Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FrequentlyBoughtTogether;