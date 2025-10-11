'use client'
import { addToCartAPI } from "../lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
  Heart,
  XIcon, // New: Import XIcon for modal close button
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import RatingModal from "./RatingModal";
import { toggleWishlistAPI } from '@/lib/features/wishlist/wishlistSlice'

const ProductDetails = ({ product }) => {
  const { currentUser } = useAuth();
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const isWishlisted = wishlistItems.includes(product.id);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size);
  const [ratingModal, setRatingModal] = useState(null);
  
  // New State for Zoom Modal
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  // Removed magnifier related states and effects (showMagnifier, position, dimensions, imageContainerRef, useEffect, handleMouseMove)
  // ... (Removed unused magnifier logic)

  const itemInCart = Object.values(cartItems).find(
    (item) =>
      item.productId === productId &&
      item.color === (selectedColor || null) &&
      item.size === (selectedSize || null)
  );

  const addToCartHandler = () => {
    if (!currentUser) {
        sessionStorage.setItem('pendingAction', JSON.stringify({
            type: 'ADD_TO_CART',
            payload: { productId, color: selectedColor, size: selectedSize }
        }));
        router.push(`/login?nextUrl=/product/${productId}`);
        return;
    }
    const promise = dispatch(addToCartAPI({ productId, color: selectedColor, size: selectedSize }));
    toast.promise(promise, {
        loading: 'Adding to cart...',
        success: 'Added to cart!',
        error: (err) => err.payload || 'Could not add to cart.',
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
        sessionStorage.setItem('pendingAction', JSON.stringify({
            type: 'TOGGLE_WISHLIST',
            payload: product.id
        }));
        router.push(`/login?nextUrl=/product/${productId}`);
        return;
    }
    dispatch(toggleWishlistAPI(product.id));
  };
  
  const removeFromCartHandler = () => {
     console.log("Remove from cart action should be handled by an API thunk.");
  };

  const handleZoom = (imageSrc) => {
    setZoomImage(imageSrc);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomImage(null);
  };


  const averageRating =
    product?.ratings?.length > 0
      ? product.ratings.reduce((acc, item) => acc + item.rating, 0) /
        product.ratings.length
      : 0;

  const hasUserRated = product?.ratings?.some(rating => rating.userId === currentUser?.uid);


  return (
    <div className="flex max-lg:flex-col gap-12 relative">
      {/* Image Gallery */}
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
            >
              <Image
                src={image}
                className="group-hover:scale-103 group-active:scale-95 transition"
                alt=""
                width={45}
                height={45}
              />
            </div>
          ))}
        </div>
        {/* Main Image Container */}
        <div
          onClick={() => handleZoom(mainImage)} // Trigger zoom on click
          className="relative flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg overflow-hidden cursor-zoom-in"
        >
          <Image
            src={mainImage}
            alt={product.name}
            width={250}
            height={250}
            style={{ width: "auto", height: "auto" }}
            className="transition-transform duration-300 hover:scale-105"
          />
          {/* Wishlist Icon on Main Image */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Heart size={20} className={`transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
          </button>
        </div>
        {/* Removed Magnifier Div */}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">
          {product.name}
        </h1>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={16}
                className="text-transparent mt-0.5"
                fill={averageRating.toFixed(0) >= index + 1 ? "#f59e0b" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            ({product?.ratings?.length} Reviews)
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>
            {currency}
            {product.price}
          </p>
          <p className="text-xl text-slate-500 line-through">
            {currency}
            {product.mrp}
          </p>
        </div>
        
        {product.variants && product.variants.length > 0 && (
          <>
            <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-600 mb-2">Color</h3>
                <div className="flex items-center gap-2">
                {[...new Set(product.variants.map(v => v.color))].map((color) => (
                    <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`size-8 rounded-full border-2 transition ${
                        selectedColor === color
                        ? "border-indigo-500 scale-110"
                        : "border-slate-200"
                    }`}
                    style={{ backgroundColor: color }}
                    />
                ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-600 mb-2">Size</h3>
                <div className="flex items-center gap-2">
                {[...new Set(product.variants.map(v => v.size))].map((size) => (
                    <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-md transition ${
                        selectedSize === size
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                    >
                    {size}
                    </button>
                ))}
                </div>
            </div>
          </>
        )}


        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>
            Save{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
            right now
          </p>
        </div>

        <div className="flex items-end gap-5 mt-8">
          {!itemInCart ? (
            <button
              onClick={addToCartHandler}
              className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
            >
              Add to Cart
            </button>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
                  <button
                    onClick={removeFromCartHandler}
                    className="p-1 select-none text-lg"
                  >
                    -
                  </button>
                  <p className="p-1 w-6 text-center">{itemInCart.quantity}</p>
                  <button
                    onClick={addToCartHandler}
                    className="p-1 select-none text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => router.push("/cart")}
                className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
              >
                View Cart
              </button>
            </>
          )}
        </div>

        <hr className="border-gray-300 my-6" />
        
        {/* Add Review Button - For testing purposes */}
        {process.env.NEXT_PUBLIC_ENABLE_OPEN_REVIEWS === 'true' && currentUser && (
            <div className="my-6">
                <button
                    onClick={() => setRatingModal({ productId: product.id })}
                    disabled={hasUserRated}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200 transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    {hasUserRated ? "You've already reviewed this product" : "Write a Review"}
                </button>
            </div>
        )}
        
        {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}

        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            <EarthIcon className="text-slate-400" /> Free shipping worldwide
          </p>
          <p className="flex gap-3">
            <CreditCardIcon className="text-slate-400" /> 100% Secured Payment
          </p>
          <p className="flex gap-3">
            <UserIcon className="text-slate-400" /> Trusted by top brands
          </p>
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity"
          onClick={closeZoom} // Close on backdrop click
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={closeZoom} 
              className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 p-2 transition-all rounded-full bg-black/50 hover:bg-black/70"
            >
              <XIcon size={32} />
            </button>
            
            {/* Zoomed Image Container */}
            <div className="max-w-full max-h-full transition-transform duration-500 ease-in-out transform">
              <Image
                src={zoomImage}
                alt="Zoomed Product Image"
                width={1000} // Set large width for high resolution
                height={1000} // Set large height for high resolution
                style={{ width: 'auto', height: 'auto', maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
                className="rounded-lg shadow-2xl transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;