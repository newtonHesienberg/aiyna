"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import DatePickerInput from "@/components/DatePickerInput";

// This is the default page for the /profile route
export default function ProfilePage() {
    const { currentUser } = useAuth();
    const [dob, setDob] = useState(null);
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
                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="dob">
                        DOB
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
}

