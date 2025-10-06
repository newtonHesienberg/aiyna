"use client";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, ShoppingBag, MapPin, CreditCard, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// This layout wraps all pages inside the /profile directory
export default function ProfileLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error('Failed to log out.');
        }
    };

    // Define sidebar items with their corresponding routes
    const sidebarItems = [
        { name: "Profile", href: "/profile", icon: User },
        { name: "Orders", href: "/orders", icon: ShoppingBag },
        { name: "Addresses", href: "/addresses", icon: MapPin },
        { name: "Support", href: "/support", icon: MessageSquare},
        { name: "Feedback", href: "/feedback", icon: MessageSquare },
    ];

    // Helper function to get the name of the current active tab for the title
    const getActiveTabName = () => {
        const activeItem = sidebarItems.find(item => pathname === item.href);
        return activeItem ? activeItem.name : 'Profile';
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <ul>
                                {sidebarItems.map((item) => (
                                    <li key={item.name} className="mb-2">
                                        <Link
                                            href={item.href}
                                            className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                                                pathname === item.href
                                                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                        >
                                            <item.icon size={20} />
                                            <span>{item.name}</span>
                                            {item.hasBadge && (
                                                <span className="ml-auto bg-green-500 w-2.5 h-2.5 rounded-full"></span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-200 mt-4 pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area where child pages will be rendered */}
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{getActiveTabName()}</h2>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

