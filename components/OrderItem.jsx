'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import RatingModal from "./RatingModal";
import { useAuth } from "../app/context/AuthContext";

const OrderItem = ({ order }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const { currentUser } = useAuth();
    
    const products = useSelector(state => state.product.list);

    // Check if the user has already rated a product in this order by checking all products
    const hasUserRated = (productId) => {
        const product = products.find(p => p.id === productId);
        return product?.ratings?.some(rating => rating.userId === currentUser?.uid);
    }

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto object-contain"
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.priceAtPurchase} Qty : {item.quantity} </p>
                                    <p className="mb-1 text-slate-400">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {process.env.NEXT_PUBLIC_ENABLE_OPEN_REVIEWS !== 'true' && order.status === "DELIVERED" && !hasUserRated(item.productId) && (
                                            <button 
                                                onClick={() => setRatingModal({ productId: item.productId })} 
                                                className={`text-indigo-500 hover:bg-indigo-50 transition p-1 rounded font-medium`}
                                            >
                                                Rate Product
                                            </button>
                                        )}
                                        {hasUserRated(item.productId) && <p className="text-green-600 text-xs font-medium">You've already rated this.</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden font-medium text-slate-700">{currency}{order.total}</td>

                <td className="text-left max-md:hidden text-slate-600 leading-relaxed">
                    <p>{order.shippingAddress.name}, {order.shippingAddress.street},</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}, {order.shippingAddress.country},</p>
                    <p>Ph: {order.shippingAddress.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`inline-flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === 'DELIVERED' ? 'text-green-700 bg-green-100' :
                            order.status === 'SHIPPED' ? 'text-blue-700 bg-blue-100' :
                            order.status === 'PROCESSING' ? 'text-yellow-700 bg-yellow-100' :
                            'text-slate-600 bg-slate-100'
                        }`}
                    >
                        <DotIcon size={10} className="scale-150" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5} className="pt-2 pb-4 text-slate-600 leading-relaxed">
                    <p>{order.shippingAddress.name}, {order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                    <p>Ph: {order.shippingAddress.phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className={`text-center mx-auto px-6 py-1.5 rounded text-xs font-medium ${
                            order.status === 'DELIVERED' ? 'text-green-700 bg-green-100' :
                            order.status === 'SHIPPED' ? 'text-blue-700 bg-blue-100' :
                            order.status === 'PROCESSING' ? 'text-yellow-700 bg-yellow-100' :
                            'text-slate-600 bg-slate-100'
                        }`} >
                            {order.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-200 w-full" />
                </td>
            </tr>
            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </>
    )
}

export default OrderItem