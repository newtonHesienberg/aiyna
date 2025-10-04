"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus, Home, Building } from "lucide-react";
import ProfileSidebar from "@/components/ProfileSideBar";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/components/Loading";

// Main Page Component
export default function AddressesPage() {
    const { currentUser } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    // Fetches all addresses from the API
    const fetchAddresses = useCallback(async () => {
        if (currentUser) {
            setIsLoading(true);
            try {
                const idToken = await currentUser.getIdToken();
                const response = await fetch('/api/addresses', {
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch addresses.');
                const data = await response.json();
                setAddresses(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }, [currentUser]);

    // Initial fetch on component mount
    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleAddNew = () => {
        setEditingAddress(null);
        setShowModal(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!currentUser) return toast.error("You must be logged in.");

        if (window.confirm("Are you sure you want to delete this address?")) {
            const deletePromise = async () => {
                const idToken = await currentUser.getIdToken();
                const response = await fetch(`/api/addresses/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete address.');
                }
            };

            await toast.promise(deletePromise(), {
                loading: 'Deleting address...',
                success: 'Address removed!',
                error: (err) => err.message,
            });
            
            fetchAddresses(); // Re-fetch addresses after successful deletion
        }
    };
    
    const handleSave = async (formData) => {
        if (!currentUser) return toast.error("You must be logged in.");

        const addressData = {
            name: formData.name,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
        };

        const savePromise = async () => {
            const idToken = await currentUser.getIdToken();
            const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
            const method = editingAddress ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify(addressData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save address.');
            }
        };

        await toast.promise(savePromise(), {
            loading: 'Saving address...',
            success: editingAddress ? 'Address updated!' : 'Address added!',
            error: (err) => err.message,
        });

        setShowModal(false);
        fetchAddresses(); // Re-fetch addresses after successful save
    };
    

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">My Addresses</h2>
                                <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors">
                                    <Plus size={20} />
                                    <span>Add New</span>
                                </button>
                            </div>
                            
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loading />
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {addresses.map(addr => (
                                        <AddressCard 
                                            key={addr.id} 
                                            address={addr} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState onAddNew={handleAddNew} />
                            )}
                        </div>
                    </main>
                </div>
            </div>
            {showModal && (
                <AddressFormModal 
                    address={editingAddress}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}


// Address Card Component
function AddressCard({ address, onEdit, onDelete }) {
    const Icon = address.name.toLowerCase() === 'work' ? Building : Home;
    return (
        <div className='p-5 border border-slate-300 rounded-lg transition-all'>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Icon className="text-slate-500" size={24} />
                    <div>
                        <h3 className="font-semibold text-slate-800">{address.name}</h3>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onEdit(address)} className="text-slate-500 hover:text-indigo-600"><Edit size={18} /></button>
                    <button onClick={() => onDelete(address.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
            </div>
            <div className="text-sm text-slate-600 mt-3 space-y-1 pl-10">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>Phone: {address.phone}</p>
            </div>
        </div>
    );
}

// Modal Form Component with Floating Labels
function AddressFormModal({ address, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: address?.name || '',
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        country: address?.country || '',
        phone: address?.phone || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const inputGroupStyle = "relative";
    const inputStyle = "block w-full px-3 py-3 text-sm text-slate-900 bg-transparent rounded-md border border-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 peer";
    const labelStyle = "absolute text-sm text-slate-500 bg-white px-1 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-600";


    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6">{address ? 'Edit Address' : 'Add a New Address'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={inputGroupStyle}>
                        <input type="text" id="name" name="name" className={inputStyle} placeholder=" " value={formData.name} onChange={handleChange} required />
                        <label htmlFor="name" className={labelStyle}>Name (e.g., Home, Work)</label>
                    </div>
                    <div className={inputGroupStyle}>
                        <input type="text" id="street" name="street" className={inputStyle} placeholder=" " value={formData.street} onChange={handleChange} required />
                        <label htmlFor="street" className={labelStyle}>Street Address</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={inputGroupStyle}>
                            <input type="text" id="city" name="city" className={inputStyle} placeholder=" " value={formData.city} onChange={handleChange} required />
                            <label htmlFor="city" className={labelStyle}>City</label>
                        </div>
                        <div className={inputGroupStyle}>
                            <input type="text" id="state" name="state" className={inputStyle} placeholder=" " value={formData.state} onChange={handleChange} required />
                            <label htmlFor="state" className={labelStyle}>State</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={inputGroupStyle}>
                            <input type="text" id="zipCode" name="zipCode" className={inputStyle} placeholder=" " value={formData.zipCode} onChange={handleChange} required />
                            <label htmlFor="zipCode" className={labelStyle}>Zip Code</label>
                        </div>
                        <div className={inputGroupStyle}>
                            <input type="text" id="country" name="country" className={inputStyle} placeholder=" " value={formData.country} onChange={handleChange} required />
                            <label htmlFor="country" className={labelStyle}>Country</label>
                        </div>
                    </div>
                    <div className={inputGroupStyle}>
                        <input type="tel" id="phone" name="phone" className={inputStyle} placeholder=" " value={formData.phone} onChange={handleChange} required />
                        <label htmlFor="phone" className={labelStyle}>Phone Number</label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 rounded-md hover:bg-slate-700">
                            {address ? 'Update Address' : 'Save Address'}
                        </button>
                        <button type="button" onClick={onClose} className="w-full bg-slate-100 font-semibold py-3 rounded-md hover:bg-slate-200">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({ onAddNew }) {
    return (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-700">No Addresses Found</h3>
            <p className="text-slate-500 mt-2 mb-4">Get started by adding a new shipping address.</p>
            <button onClick={onAddNew} className="flex items-center gap-2 mx-auto bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors">
                <Plus size={20} />
                <span>Add New Address</span>
            </button>
        </div>
    );
}