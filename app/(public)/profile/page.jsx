"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { User, ShoppingBag, MapPin, CreditCard, MessageSquare, LogOut, Trash2, Edit } from "lucide-react";

// Main component for the entire page
export default function ProfilePage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("Profile");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        dob: "",
        gender: "",
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.displayName?.split(" ")[0] || "",
                lastName: currentUser.displayName?.split(" ")[1] || "",
                email: currentUser.email || "",
                mobileNumber: currentUser.phoneNumber || "",
                dob: "",
                gender: "",
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving data:", formData);
        toast.success("Profile updated successfully!");
    };

    const sidebarItems = [
        { name: "Profile", icon: User },
        { name: "Orders", icon: ShoppingBag },
        { name: "Addresses", icon: MapPin },
        { name: "Payment", icon: CreditCard },
        { name: "Support", icon: MessageSquare, hasBadge: true },
        { name: "Feedback & Suggestion", icon: MessageSquare },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Profile":
                return <ProfileContent formData={formData} handleChange={handleChange} handleSave={handleSave} />;
            case "Payment":
                return <PaymentsContent />;
            case "Addresses":
                return <AddressesContent />;
            case "Feedback & Suggestion":
                return <FeedbackContent />;
            case "Orders":
                return <div className="p-6 text-center text-slate-500">Your orders will be displayed here.</div>;
            default:
                return <div className="p-6 text-center text-slate-500">{activeTab} content coming soon.</div>;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <ul>
                                {sidebarItems.map((item) => (
                                    <li key={item.name} className="mb-2">
                                        <button
                                            onClick={() => setActiveTab(item.name)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                                                activeTab === item.name
                                                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                        >
                                            <item.icon size={20} />
                                            <span>{item.name}</span>
                                            {item.hasBadge && (
                                                <span className="ml-auto bg-green-500 w-2.5 h-2.5 rounded-full"></span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-200 mt-4 pt-4">
                                <button
                                    className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{activeTab}</h2>
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Sub-component for Profile content
const ProfileContent = ({ formData, handleChange, handleSave }) => (
    <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="firstName">
                    First Name *
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="form-group">
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="lastName">
                    Last Name *
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
        </div>
        <div className="form-group mt-6">
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email">
                Email *
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
                className="w-full p-3 border border-slate-300 rounded-md bg-slate-100 cursor-not-allowed"
            />
        </div>
        <div className="form-group mt-6">
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="mobileNumber">
                Mobile Number *
            </label>
            <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <div className="form-group mt-6">
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="dob">
                DOB
            </label>
            <input
                type="text"
                id="dob"
                name="dob"
                placeholder="mm / dd / yyyy"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <div className="form-group mt-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">Gender</label>
            <div className="flex gap-6">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-700">Male</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-700">Female</span>
                </label>
            </div>
        </div>
        <div className="mt-8">
            <button
                type="submit"
                className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700 transition-colors"
            >
                Save Changes
            </button>
        </div>
    </form>
);

// Sub-component for Payments content
const PaymentsContent = () => {
    const [showAddCard, setShowAddCard] = useState(false);
    // Mock data for saved cards
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
                        <button className="text-red-500 hover:text-red-700">
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
                            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cardName">
                                Name on Card
                            </label>
                            <input type="text" id="cardName" className="w-full p-3 border border-slate-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cardNumber">
                                Card Number
                            </label>
                            <input type="text" id="cardNumber" placeholder="•••• •••• •••• ••••" className="w-full p-3 border border-slate-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="expiryDate">
                                    Expiry Date
                                </label>
                                <input type="text" id="expiryDate" placeholder="MM/YY" className="w-full p-3 border border-slate-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="cvv">
                                    CVV
                                </label>
                                <input type="text" id="cvv" placeholder="•••" className="w-full p-3 border border-slate-300 rounded-md" required />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700">
                            Save Card
                        </button>
                        <button type="button" onClick={() => setShowAddCard(false)} className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// Sub-component for Addresses content
const AddressesContent = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addresses, setAddresses] = useState([
        { id: 1, name: 'Home', address: '123 Maple St, Springfield, IL, 62704', phone: '555-123-4567' },
        { id: 2, name: 'Work', address: '456 Oak Ave, Springfield, IL, 62704', phone: '555-987-6543' },
    ]);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

    useEffect(() => {
        if (editingAddress) {
            setFormData(editingAddress);
            setShowForm(true);
        } else {
            setFormData({ name: '', address: '', phone: '' });
        }
    }, [editingAddress]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            // Update logic
            setAddresses(addresses.map(addr => addr.id === editingAddress.id ? formData : addr));
            toast.success("Address updated successfully!");
        } else {
            // Add new logic
            setAddresses([...addresses, { ...formData, id: Date.now() }]);
            toast.success("New address added successfully!");
        }
        setEditingAddress(null);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success("Address removed.");
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Saved Addresses</h3>
            <div className="space-y-4 mb-6">
                {addresses.map(addr => (
                    <div key={addr.id} className="flex justify-between items-start p-4 border border-slate-200 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-800">{addr.name}</p>
                            <p className="text-sm text-slate-500">{addr.address}</p>
                            <p className="text-sm text-slate-500">Phone: {addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingAddress(addr)} className="text-slate-500 hover:text-indigo-600"><Edit size={20} /></button>
                            <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {!showForm ? (
                <button
                    onClick={() => { setEditingAddress(null); setShowForm(true); }}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200 transition-colors"
                >
                    Add New Address
                </button>
            ) : (
                <form onSubmit={handleFormSubmit} className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">{editingAddress ? 'Edit Address' : 'Add a New Address'}</h3>
                    <div className="space-y-4">
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Address Label (e.g., Home)" className="w-full p-3 border border-slate-300 rounded-md" required />
                        <textarea name="address" value={formData.address} onChange={handleFormChange} placeholder="Full Address" className="w-full p-3 border border-slate-300 rounded-md" rows="3" required></textarea>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Phone Number" className="w-full p-3 border border-slate-300 rounded-md" required />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700">
                            {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingAddress(null); }} className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-md hover:bg-slate-200">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// Sub-component for Feedback & Suggestion content
const FeedbackContent = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Thank you for your feedback!");
        e.target.reset();
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className="text-slate-600 mb-6">We value your input! Please share any feedback or suggestions you have to help us improve.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="feedbackSubject">
                        Subject
                    </label>
                    <input type="text" id="feedbackSubject" className="w-full p-3 border border-slate-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="feedbackMessage">
                        Message
                    </label>
                    <textarea id="feedbackMessage" className="w-full p-3 border border-slate-300 rounded-md" rows="5" required></textarea>
                </div>
            </div>
            <div className="mt-6">
                <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700">
                    Submit Feedback
                </button>
            </div>
        </form>
    );
};

