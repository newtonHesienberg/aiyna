"use client";
import { ChevronDown, Search, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { assets, categoryData } from "@/assets/assets";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist); // 2. Get wishlist items

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const wishlistCount = wishlistItems.length; // 3. Get wishlist count

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link href="/">
            <Image
              src={assets.aina_logo}
              alt="Aina Logo"
              width={100}
              height={40}
              className="h-auto"
            />
          </Link>

          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>

            {categoryData.map((category) => (
              <div key={category.name} className="relative group">
                <Link href={category.path} className="flex items-center gap-1">
                  {category.name}
                  <ChevronDown
                    size={16}
                    className="transition-transform group-hover:rotate-180"
                  />
                </Link>

                <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg rounded-md mt-0 py-2 z-50 border border-slate-100">
                  {category.subCategories.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      <sub.icon size={16} className="text-slate-500" />
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

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

            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-indigo-500 size-4 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 text-[10px] font-sans font-bold flex items-center justify-center text-white bg-slate-600 size-4 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
              Login
            </button>
          </div>

          <div className="sm:hidden">
            <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
              Login
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
