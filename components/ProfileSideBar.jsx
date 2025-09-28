"use client";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
    User, ShoppingBag, MapPin, CreditCard,
    MessageSquare, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfileSidebar() {
    const { currentUser } = useAuth();
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

    const sidebarItems = [
        { name: "Profile", icon: User, href: "/profile" },
        { name: "Orders", icon: ShoppingBag, href: "/orders" },
        { name: "Addresses", icon: MapPin, href: "/addresses" },
        { name: "Payment", icon: CreditCard, href: "/payments" },
        { name: "Support", icon: MessageSquare, href: "/support" },
        { name: "Feedback & Suggestion", icon: MessageSquare, href: "/feedback" },
    ];

    if (!currentUser) {
        return null; // Or a loading spinner
    }

    return (
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
    );
}
