"use client";

import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"; // 1. Import useEffect
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  // --- MAGNIFIER STATE AND LOGIC (CORRECTED) ---
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // State to hold container dimensions
  const imageContainerRef = useRef(null);
  const magnifierSize = 100;
  const zoomLevel = 1.5;

  // Effect to measure the image container's dimensions
  useEffect(() => {
    if (imageContainerRef.current) {
      const { width, height } =
        imageContainerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [mainImage]); // Re-measure if the main image changes

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top } = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({ x, y });
  };
  // --- END OF MAGNIFIER LOGIC ---

  const itemId = `${productId}_${selectedColor}_${selectedSize}`;
  const itemInCart = cartItems[itemId];
  const addToCartHandler = () => {
    dispatch(
      addToCart({ productId, color: selectedColor, size: selectedSize })
    );
  };
  const removeFromCartHandler = () => {
    dispatch(removeFromCart({ itemId }));
  };
  const averageRating =
    product.rating.reduce((acc, item) => acc + item.rating, 0) /
    product.rating.length;

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
          ref={imageContainerRef}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
          className="relative flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg overflow-hidden"
        >
          <Image
            src={mainImage}
            alt={product.name}
            width={250}
            height={250}
            style={{ width: "auto", height: "auto" }}
          />

          {/* The Magnifier Lens (visible on hover) */}
          <div
            style={{
              display: showMagnifier ? "block" : "none",
              position: "absolute",
              left: `${position.x - magnifierSize / 2}px`,
              top: `${position.y - magnifierSize / 2}px`,
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              pointerEvents: "none",
              border: "2px solid #cbd5e1",
              borderRadius: "50%",
              backgroundImage: `url(${mainImage.src})`, // Use .src directly
              backgroundRepeat: "no-repeat",
              // Use dimensions from state
              backgroundSize: `${dimensions.width * zoomLevel}px ${
                dimensions.height * zoomLevel
              }px`,
              backgroundPosition: `-${
                position.x * zoomLevel - magnifierSize / 2
              }px -${position.y * zoomLevel - magnifierSize / 2}px`,
              backgroundColor: "#fff",
            }}
          />
        </div>
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
                size={14}
                className="text-transparent mt-0.5"
                fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            {product.rating.length} Reviews
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>
            {" "}
            {currency}
            {product.price}{" "}
          </p>
          <p className="text-xl text-slate-500 line-through">
            {currency}
            {product.mrp}
          </p>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Color</h3>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`size-8 rounded-full border-2 transition ${
                    selectedColor === color
                      ? "border-green-500 scale-110"
                      : "border-slate-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Size</h3>
            <div className="flex items-center gap-2">
              {product.sizes.map((size) => (
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
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            {" "}
            <EarthIcon className="text-slate-400" /> Free shipping worldwide{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <CreditCardIcon className="text-slate-400" /> 100% Secured Payment{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <UserIcon className="text-slate-400" /> Trusted by top brands{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
