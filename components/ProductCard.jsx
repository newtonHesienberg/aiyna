'use client'
import { Heart, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlistAPI } from '@/lib/features/wishlist/wishlistSlice'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product }) => {
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

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto'>
            <div className='relative bg-[#F5F5F5] h-52 sm:h-80 rounded-lg flex items-center justify-center'>
                <Image width={500} height={500} className='max-h-40 sm:max-h-60 w-auto group-hover:scale-105 transition duration-300' src={product.images[0]} alt={product.name} />
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                    <Heart size={20} className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
                </button>
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#f59e0b" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard;