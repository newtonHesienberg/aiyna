"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit } from "lucide-react";
import ProfileSidebar from "@/components/ProfileSideBar";
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth

export default function AddressesPage() {
    const { currentUser } = useAuth(); // Get the current user
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addresses, setAddresses] = useState([]); // Start with an empty array
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

    // Effect to fetch addresses from the API
    useEffect(() => {
        const fetchAddresses = async () => {
            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken();
                    const response = await fetch('/api/addresses', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch addresses.');
                    }

                    const data = await response.json();
                    setAddresses(data);
                } catch (error) {
                    toast.error(error.message);
                }
            }
        };

        fetchAddresses();
    }, [currentUser]);


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
        // This part would also be an API call in a full implementation
        if (editingAddress) {
            setAddresses(addresses.map(addr => addr.id === editingAddress.id ? formData : addr));
            toast.success("Address updated!");
        } else {
            setAddresses([...addresses, { ...formData, id: Date.now() }]);
            toast.success("New address added!");
        }
        setEditingAddress(null);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        // This part would also be an API call in a full implementation
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success("Address removed.");
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Addresses</h2>
                            <div className="space-y-4 mb-6">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="flex justify-between items-start p-4 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">{addr.name}</p>
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
                                <button onClick={() => { setEditingAddress(null); setShowForm(true); }} className="w-full bg-slate-100 font-semibold py-3 rounded-md hover:bg-slate-200">
                                    Add New Address
                                </button>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">{editingAddress ? 'Edit Address' : 'Add a New Address'}</h3>
                                    <div className="space-y-4">
                                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Address Label (e.g., Home)" className="w-full p-3 border rounded-md" required />
                                        <textarea name="address" value={formData.address} onChange={handleFormChange} placeholder="Full Address" className="w-full p-3 border rounded-md" rows="3" required></textarea>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Phone Number" className="w-full p-3 border rounded-md" required />
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 rounded-md hover:bg-slate-700">
                                            {editingAddress ? 'Update Address' : 'Save Address'}
                                        </button>
                                        <button type="button" onClick={() => { setShowForm(false); setEditingAddress(null); }} className="w-full bg-slate-100 font-semibold py-3 rounded-md hover:bg-slate-200">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}