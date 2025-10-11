'use client'
import { Heart, StarIcon, Gem } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlistAPI } from '@/lib/features/wishlist/wishlistSlice'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product, isHomePage }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentUser } = useAuth();
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const isWishlisted = wishlistItems.includes(product.id);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            sessionStorage.setItem('pendingAction', JSON.stringify({
                type: 'TOGGLE_WISHLIST',
                payload: product.id
            }));
            router.push(`/login?nextUrl=${window.location.pathname}${window.location.search}`);
            return;
        }
        dispatch(toggleWishlistAPI(product.id));
    };

    const averageRating =
      product?.ratings?.length > 0
        ? Math.round(product.ratings.reduce((acc, item) => acc + item.rating, 0) / product.ratings.length)
        : 0;

    // Find the highlight spec from the product data
    const highlightSpec = product.specs?.find(spec => spec.key === 'product_card_highlight');
    
    // Conditional classes for home page vs other pages to control aspect ratio
    const imageContainerClasses = isHomePage
        ? "relative bg-slate-100 aspect-[3/4] rounded-t-lg flex items-center justify-center overflow-hidden" // Portrait ratio for home page
        : "relative bg-slate-100 h-60 sm:h-80 rounded-t-lg flex items-center justify-center overflow-hidden"; // Taller, flexible height for other pages


    return (
        <Link href={`/product/${product.id}`} className='group block w-full bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-300 flex flex-col'>
            <div className={imageContainerClasses}>
                <Image
                    width={500}
                    height={500}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                    src={product.images[0]}
                    alt={product.name}
                />
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform z-20"
                >
                    <Heart size={20} className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
                </button>
                
                {/* Highlight Graphic: Renders only if the spec is found */}
                {highlightSpec && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-20">
                        <Gem size={12} />
                        <span>{highlightSpec.value}</span>
                    </div>
                )}
            </div>
            <div className='p-3 flex flex-col flex-grow'>
                <h3 className='font-medium text-sm text-slate-800'>{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 truncate">{product.description}</p>
                <div className='flex mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent' fill={averageRating >= index + 1 ? "#f59e0b" : "#D1D5DB"} />
                    ))}
                </div>
                <div className='flex items-baseline gap-2 mt-auto pt-2'>
                    <p className='font-semibold text-slate-800'>{currency}{product.price}</p>
                    <p className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;