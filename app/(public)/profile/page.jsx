"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import DatePickerInput from "@/components/DatePickerInput";
import Loading from "@/components/Loading";

export default function ProfilePage() {
    const { currentUser } = useAuth();
    const [dob, setDob] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        gender: "",
    });

    const [isLoading, setIsLoading] = useState(true);

    // This function was missing. It updates the form state as you type.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (currentUser) {
                // 1. Try to load from session storage for an instant UI update
                const cachedProfile = sessionStorage.getItem('userProfile');
                if (cachedProfile) {
                    const userDetails = JSON.parse(cachedProfile);
                    setFormData({
                        firstName: userDetails.firstName || "",
                        lastName: userDetails.lastName || "",
                        email: userDetails.email || "",
                        mobileNumber: userDetails.mobile || "",
                        gender: userDetails.gender || "",
                    });
                    if (userDetails.dob) setDob(new Date(userDetails.dob));
                    setIsLoading(false); // We have data to show, so stop loading
                }

                // 2. Always fetch fresh data from the API in the background
                try {
                    const idToken = await currentUser.getIdToken();
                    const response = await fetch(`/api/users/${currentUser.uid}`, {
                        headers: { 'Authorization': `Bearer ${idToken}` },
                    });

                    if (!response.ok) throw new Error('Failed to fetch user data.');
                    
                    const freshUserDetails = await response.json();

                    // 3. Update state and session storage with the latest data
                    setFormData({
                        firstName: freshUserDetails.firstName || "",
                        lastName: freshUserDetails.lastName || "",
                        email: freshUserDetails.email || "",
                        mobileNumber: freshUserDetails.mobile || "",
                        gender: freshUserDetails.gender || "",
                    });
                    if (freshUserDetails.dob) setDob(new Date(freshUserDetails.dob));
                    
                    sessionStorage.setItem('userProfile', JSON.stringify(freshUserDetails));

                } catch (error) {
                    console.error("Failed to re-fetch user details:", error);
                    if (!cachedProfile) { // Only show error if we have no data at all
                        toast.error("Could not load your profile.");
                    }
                } finally {
                    setIsLoading(false); // Ensure loading is off after API call
                }
            }
        };

        loadProfile();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        const indianMobileRegex = /^[6-9]\d{9}$/;
        if (formData.mobileNumber && !indianMobileRegex.test(formData.mobileNumber)) {
            toast.error('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        if (currentUser) {
            const savePromise = async () => {
                const idToken = await currentUser.getIdToken();
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    mobile: formData.mobileNumber,
                    dob: dob,
                    gender: formData.gender,
                };
                
                const response = await fetch(`/api/users/${currentUser.uid}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update profile.');
                }
                
                const { user: updatedUser } = await response.json();
                
                // On success, update session storage with the new data
                sessionStorage.setItem('userProfile', JSON.stringify(updatedUser));
            };

            toast.promise(savePromise(), {
                loading: 'Updating profile...',
                success: "Profile updated successfully!",
                error: (err) => err.message,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loading />
            </div>
        );
    }

    return (
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
                    readOnly
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-100 cursor-not-allowed"
                />
            </div>
            <div className="form-group mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="mobileNumber">
                    Mobile Number
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
            <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="dob">
                    Date of Birth
                </label>
                <DatePickerInput
                    selectedDate={dob}
                    onChange={(date) => setDob(date)}
                />
            </div>
            <div className="form-group mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Gender</label>
                <div className="flex gap-6">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={handleChange}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2 text-slate-700">Male</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
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
}