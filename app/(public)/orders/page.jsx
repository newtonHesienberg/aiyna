"use client";
import { useEffect, useState } from "react";
import { orderDummyData } from "@/assets/assets";
import OrderItem from "@/components/OrderItem";
import ProfileSidebar from "@/components/ProfileSideBar";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch this data from your API
        setOrders(orderDummyData);
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Orders</h2>
                            {orders.length > 0 ? (
                                <table className="w-full text-slate-500 table-auto border-separate border-spacing-y-6">
                                    <thead className="max-md:hidden">
                                    <tr className="text-sm text-slate-600">
                                        <th className="text-left font-semibold">Product</th>
                                        <th className="text-center font-semibold">Total Price</th>
                                        <th className="text-left font-semibold">Address</th>
                                        <th className="text-left font-semibold">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => (
                                        <OrderItem order={order} key={order.id} />
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-20 text-slate-500">
                                    <h3 className="text-xl">You have no orders yet.</h3>
                                    <p className="mt-2">Start shopping to see your orders here.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

