"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, Trash2 } from "lucide-react";
import ProfileSidebar from "@/components/ProfileSideBar";

// Component for the main content of the payments page
function PaymentsContent() {
    const [showAddCard, setShowAddCard] = useState(false);
    const [savedCards, setSavedCards] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/26' },
        { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/25' },
    ]);

    const handleAddNewCard = (e) => {
        e.preventDefault();
        const newCard = {
            id: Date.now(),
            type: 'Visa',
            last4: '1234',
            expiry: '01/28'
        };
        setSavedCards([...savedCards, newCard]);
        setShowAddCard(false);
        toast.success("New card added successfully!");
    };

    const handleDeleteCard = (id) => {
        setSavedCards(savedCards.filter(card => card.id !== id));
        toast.success("Card removed.");
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Saved Payment Methods</h3>
            <div className="space-y-4 mb-6">
                {savedCards.map(card => (
                    <div key={card.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-4">
                            <CreditCard className="text-slate-500" size={24} />
                            <div>
                                <p className="font-semibold text-slate-800">{card.type} ending in {card.last4}</p>
                                <p className="text-sm text-slate-500">Expires {card.expiry}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteCard(card.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {!showAddCard ? (
                <button
                    onClick={() => setShowAddCard(true)}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200 transition-colors"
                >
                    Add New Card
                </button>
            ) : (
                <form onSubmit={handleAddNewCard} className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Add a New Card</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cardName">Name on Card</label>
                            <input type="text" id="cardName" className="w-full p-3 border border-slate-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" placeholder="•••• •••• •••• ••••" className="w-full p-3 border border-slate-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="expiryDate">Expiry Date</label>
                                <input type="text" id="expiryDate" placeholder="MM/YY" className="w-full p-3 border border-slate-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" placeholder="•••" className="w-full p-3 border border-slate-300 rounded-md" required />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700">Save Card</button>
                        <button type="button" onClick={() => setShowAddCard(false)} className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200">Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

// Main page component that wraps the content with the sidebar and layout
export default function PaymentsPageWrapper() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Payments</h2>
                            <PaymentsContent />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

