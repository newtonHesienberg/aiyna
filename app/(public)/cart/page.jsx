'use client'
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { setCart, deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function Cart() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = async () => {
        if (currentUser) {
            setIsLoading(true);
            try {
                const idToken = await currentUser.getIdToken();
                const response = await fetch('/api/cart', {
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart.');
                }

                const data = await response.json();
                
                let tempCartArray = [];
                let tempTotalPrice = 0;
                const cartDataForRedux = {};

                data.forEach(item => {
                    tempCartArray.push({
                        ...item.product, // Spread the product details
                        cartItemId: item.id,
                        quantity: item.quantity,
                        color: item.color,
                        size: item.size,
                    });
                    tempTotalPrice += item.product.price * item.quantity;

                    // Also update redux store for consistency
                    cartDataForRedux[item.id] = {
                        cartItemId: item.id,
                        productId: item.product.id,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                    };
                });
                
                setCartArray(tempCartArray);
                setTotalPrice(tempTotalPrice);
                dispatch(setCart(cartDataForRedux));

            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        } else if (currentUser === null) {
            setIsLoading(false);
            setCartArray([]); // Clear local cart array on logout
            dispatch(setCart({})); // Clear redux cart on logout
        }
    };

    useEffect(() => {
        fetchCart();
    }, [currentUser, dispatch]);


    const handleUpdateCart = async (itemId, newQuantity) => {
        if (currentUser) {
            const updatePromise = async () => {
                const idToken = await currentUser.getIdToken();
                const response = await fetch('/api/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        cartItemId: itemId,
                        quantity: newQuantity
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update quantity.');
                }
                
                // Refetch the cart to ensure UI is in sync with the database
                await fetchCart(); 
            };

            toast.promise(updatePromise(), {
                loading: 'Updating cart...',
                success: 'Cart updated!',
                error: (err) => err.message,
            });
        }
    };

    const handleDeleteItemFromCart = async (itemId) => {
        if (currentUser) {
             const deletePromise = async () => {
                const idToken = await currentUser.getIdToken();
                const response = await fetch(`/api/cart?cartItemId=${itemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete item.');
                }
                // Refetch the cart to update the UI
                await fetchCart();
            };
             toast.promise(deletePromise(), {
                loading: 'Removing item...',
                success: 'Item removed!',
                error: (err) => err.message,
            });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto ">
                <PageTitle heading="My Cart" text={`${cartArray.length} items in your cart`} linkText="Continue Shopping" path="/shop" />

                <div className="flex items-start justify-between gap-8 max-lg:flex-col">
                    <div className="w-full lg:w-2/3">
                        <table className="w-full text-slate-600 border-separate" style={{ borderSpacing: '0 1rem' }}>
                            <thead>
                                <tr className="text-sm">
                                    <th className="text-left font-medium p-2">Product</th>
                                    <th className="font-medium p-2">Quantity</th>
                                    <th className="font-medium p-2">Total Price</th>
                                    <th className="font-medium p-2">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartArray.map((item) => (
                                        <tr key={item.cartItemId}>
                                            <td>
                                                <div className="flex gap-4 items-center">
                                                    <div className="bg-slate-100 p-2 rounded-md">
                                                        <Image src={item.images[0]} className="h-20 w-20 object-contain" alt={item.name} width={80} height={80} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-700">{item.name}</p>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                            <span>Color:</span>
                                                            <div className="size-4 rounded-full border border-slate-300" style={{ backgroundColor: item.color }}></div>
                                                            <span>|</span>
                                                            <span>Size: {item.size}</span>
                                                        </div>
                                                        <p className="text-sm font-semibold mt-1">{currency}{item.price}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="inline-flex items-center gap-3 px-3 py-2 rounded border border-slate-200 text-slate-600">
                                                    <button onClick={() => handleUpdateCart(item.cartItemId, item.quantity - 1)} className="select-none">-</button>
                                                    <p>{item.quantity}</p>
                                                    <button onClick={() => handleUpdateCart(item.cartItemId, item.quantity + 1)} className="select-none">+</button>
                                                </div>
                                            </td>
                                            <td className="text-center font-semibold">{currency}{(item.price * item.quantity).toFixed(2)}</td>
                                            <td className="text-center">
                                                <button onClick={() => handleDeleteItemFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700 p-2.5 rounded-full active:scale-95 transition-all">
                                                    <Trash2Icon size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                     <div className="w-full lg:w-1/3">
                        <OrderSummary totalPrice={totalPrice} items={cartArray} />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}