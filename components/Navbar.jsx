"use client";
import { ChevronDown, Search, Heart, ShoppingCart, LogOut, User, Shirt, Image as ImageIcon, Coffee, GlassWater, Accessibility, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const Navbar = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { cartItems } = useSelector((state) => state.cart);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { list: categoryData } = useSelector((state) => state.category);
    const { currentUser } = useAuth();
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // State to manage which category is open in the mobile accordion menu
    const [openCategory, setOpenCategory] = useState(null);

    const cartCount = Object.values(cartItems).reduce(
        (acc, item) => acc + item.quantity,
        0
    );
    const wishlistCount = wishlistItems.length;

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/shop?search=${search}`);
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
            setMobileMenuOpen(false);
            router.push('/');
        } catch (error) {
            toast.error('Failed to log out.');
        }
    };

    const toggleCategory = (categoryName) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    const profileMenuItems = [
        { name: 'My Account', path: '/profile' },
        { name: 'My Orders', path: '/orders' },
        { name: 'Support', path: '/support' },
    ];

    const iconMap = {
        'T-shirts': Shirt,
        'Hoodies': Shirt,
        'Oversized T-shirts': Accessibility,
        'Crop Top': Shirt,
        'Crop Tank': Shirt,
        'Wall Posters': ImageIcon,
        'Mugs': Coffee,
        'Water Bottles': GlassWater,
    };


    return (
        <nav className="relative bg-white z-40">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                    {/* Hamburger Menu Icon for Mobile */}
                    <button className="sm:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={24} className="text-slate-700" />
                    </button>

                    <Link href="/">
                        <Image
                            src={assets.aiyna_logo}
                            alt="Aina Logo"
                            width={100}
                            height={40}
                            className="h-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>

                        {categoryData.map((category) => (
                            <div key={category.id} className="relative group">
                                <Link href={`/shop?category=${category.name}`} className="flex items-center gap-1">
                                    {category.name}
                                    <ChevronDown
                                        size={16}
                                        className="transition-transform group-hover:rotate-180"
                                    />
                                </Link>

                                <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg rounded-md mt-0 py-2 z-50 border border-slate-100">
                                    {category.subCategories.map((sub) => {
                                        const Icon = iconMap[sub.name] || Shirt;
                                        return (
                                            <Link
                                                key={sub.id}
                                                href={`/shop?subCategory=${sub.name}`}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                                            >
                                                <Icon size={16} className="text-slate-500" />
                                                {sub.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Icons and Login for Desktop */}
                    <div className="hidden sm:flex items-center gap-4">
                        <form
                            onSubmit={handleSearch}
                            className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
                        >
                            <Search size={18} className="text-slate-600" />
                            <input
                                className="w-full bg-transparent outline-none placeholder-slate-600"
                                type="text"
                                placeholder="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        <Link href="/wishlist" className="relative p-2">
                            <Heart size={18} />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-indigo-500 size-4 rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="relative p-2">
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-slate-600 size-4 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {currentUser ? (
                            <div
                                className="relative flex items-center gap-4"
                                onMouseEnter={() => setProfileMenuOpen(true)}
                                onMouseLeave={() => setProfileMenuOpen(false)}
                            >
                                <Link href="/profile" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                    <Image
                                        src={currentUser.photoURL || assets.generic_profile_image}
                                        alt="Profile"
                                        width={100}
                                        height={100}
                                        className="w-9 h-9 rounded-full"
                                    />
                                </Link>
                                {isProfileMenuOpen && (
                                    <div className="absolute top-full right-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-slate-100">
                                        {profileMenuItems.map(item => (
                                            <Link key={item.name} href={item.path} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                                {item.name}
                                            </Link>
                                        ))}
                                        <div className="border-t border-slate-200 my-2"></div>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => router.push('/login')} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                Login
                            </button>
                        )}
                    </div>

                     {/* Icons for Mobile */}
                    <div className="sm:hidden flex items-center gap-2">
                         <Link href="/wishlist" className="relative p-2">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-indigo-500 size-4 rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="relative p-2">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-slate-600 size-4 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {currentUser && (
                            <Link href="/profile" className="p-2">
                                <User size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`fixed inset-0 z-50 bg-white transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform sm:hidden`}>
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                         <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                            <Image src={assets.aiyna_logo} alt="Aina Logo" width={100} height={40} className="h-auto"/>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X size={24} className="text-slate-700" />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full mb-6">
                        <Search size={18} className="text-slate-600" />
                        <input className="w-full bg-transparent outline-none" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                    </form>
                    
                    <nav className="flex flex-col gap-2 text-slate-700">
                        <Link href="/" className="py-3 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        {categoryData.map((category) => (
                            <div key={category.id} className="border-b border-slate-200">
                               <button onClick={() => toggleCategory(category.name)} className="w-full flex justify-between items-center py-3 font-medium">
                                   {category.name}
                                   <ChevronDown size={16} className={`transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`} />
                                </button>
                                {openCategory === category.name && (
                                    <div className="pl-4 pb-2">
                                        {category.subCategories.map((sub) => (
                                            <Link key={sub.id} href={`/shop?subCategory=${sub.name}`} className="flex items-center gap-3 py-2 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="mt-8 border-t pt-6">
                        {currentUser ? (
                             <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 font-medium">
                                Logout
                            </button>
                        ): (
                            <button onClick={() => {router.push('/login'); setMobileMenuOpen(false);}} className="w-full px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-gray-300" />
        </nav>
    );
};

export default Navbar;