'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { addToCart, deleteItemFromCart, removeFromCart } from "@/lib/features/cart/cartSlice"; // Import new actions
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (products.length > 0) {
            let tempCartArray = [];
            let tempTotalPrice = 0;

            // New logic to build the cart array from the updated state structure
            for (const itemId in cartItems) {
                const item = cartItems[itemId];
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    tempCartArray.push({
                        ...product,           // Base product info (name, images, etc.)
                        ...item,              // Variation info (color, size, quantity)
                        itemId: itemId       // The unique ID for this variation
                    });
                    tempTotalPrice += product.price * item.quantity;
                }
            }
            setCartArray(tempCartArray);
            setTotalPrice(tempTotalPrice);
        }
    }, [cartItems, products]);

    // Update handlers to use the unique itemId
    const handleDeleteItemFromCart = (itemId) => {
        dispatch(deleteItemFromCart({ itemId }));
    }
    const handleAddToCart = (item) => {
        dispatch(addToCart({ productId: item.productId, color: item.color, size: item.size }));
    }
    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart({ itemId }));
    }


    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto ">
                <PageTitle heading="My Cart" text={`${cartArray.length} items in your cart`} linkText="Continue Shopping" path="/shop" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className="space-x-2">
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm">{item.name}</p>
                                                {/* Display Color and Size */}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span>Color:</span>
                                                    <div className="size-4 rounded-full border border-slate-300" style={{ backgroundColor: item.color }}></div>
                                                    <span>|</span>
                                                    <span>Size: {item.size}</span>
                                                </div>
                                                <p>{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {/* Counter needs updated logic to handle increments/decrements */}
                                            <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
                                                <button onClick={() => handleRemoveFromCart(item.itemId)} className="p-1 select-none">-</button>
                                                <p className="p-1">{item.quantity}</p>
                                                <button onClick={() => handleAddToCart(item)} className="p-1 select-none">+</button>
                                            </div>
                                        </td>
                                        <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.itemId)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}