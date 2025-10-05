"use client";
import { addToCartAPI } from "@/lib/features/cart/cartSlice"; // Use the async thunk
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

const ProductDetails = ({ product }) => {
  const { currentUser } = useAuth();
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); 
  const imageContainerRef = useRef(null);
  const magnifierSize = 100;
  const zoomLevel = 1.5;

  useEffect(() => {
    if (imageContainerRef.current) {
      const { width, height } =
        imageContainerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [mainImage]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top } = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({ x, y });
  };
  
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

  const removeFromCartHandler = () => {
     // You would need a 'removeFromCartAPI' thunk for this to work with the API
     console.log("Remove from cart action should be handled by an API thunk.");
  };

  const averageRating =
    product?.ratings?.reduce((acc, item) => acc + item?.rating, 0) /
    product?.ratings?.length;

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
              backgroundImage: `url(${mainImage})`,
              backgroundRepeat: "no-repeat",
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
            {product?.ratings?.length} Reviews
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
                        ? "border-green-500 scale-110"
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
    </div>
  );
};

export default ProductDetails;