'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Equal } from 'lucide-react'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const FrequentlyBoughtTogether = ({ currentProduct }) => {
    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.product.list);
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    // In a real app, this logic would come from a recommendation engine.
    // For now, we'll just find two other products from the same category or just the next two in the list.
    const recommendedProducts = allProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 2);

    // If there aren't enough in the same category, just grab any other two products.
    if (recommendedProducts.length < 2) {
        const otherProducts = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 2 - recommendedProducts.length);
        recommendedProducts.push(...otherProducts);
    }
    
    const allItems = [currentProduct, ...recommendedProducts];
    const totalPrice = allItems.reduce((acc, item) => acc + item.price, 0);

    const handleAddAllToCart = () => {
        allItems.forEach(item => {
            dispatch(addToCart({
                productId: item.id,
                color: item.colors?.[0], // Default to the first color/size
                size: item.sizes?.[0],
            }));
        });
        toast.success(`${allItems.length} items added to your cart!`);
    }

    if (recommendedProducts.length === 0) {
        return null; // Don't render the component if there are no other products
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