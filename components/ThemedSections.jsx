"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { themedSectionsData } from "@/assets/assets";
import Image from "next/image";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ThemedSections = () => {
  const [activeTab, setActiveTab] = useState(themedSectionsData[0].name);
  const allProducts = useSelector((state) => state.product.list);

  const activeSection = themedSectionsData.find(
    (section) => section.name === activeTab
  );

  const filteredProducts = allProducts
    .filter((product) => activeSection.categories.includes(product.category))
    .slice(0, 4);

  return (
    <div className="px-6 lg:px-12 my-20">
        {/* Tabs */}
        <div className="flex justify-center gap-4 sm:gap-8 border-b border-slate-200 mb-8">
          {themedSectionsData.map((section) => (
            <button
              key={section.name}
              onClick={() => setActiveTab(section.name)}
              className={`pb-3 text-lg font-medium transition-colors ${
                activeTab === section.name
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-indigo-500"
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- UPDATED Left Box --- */}
          {/* 1. Made it narrower with lg:w-2/5 */}
          {/* 2. Gave it a fixed height with h-[620px] for consistency */}
          <div className="relative w-full lg:w-2/5 h-[730px] rounded-2xl overflow-hidden group">
            <Image
              src={activeSection.image}
              alt={`${activeSection.name} Themed Products`}
              fill // Use `fill` to make the image cover the container
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white">
                {activeSection.title}
              </h3>
              <p className="text-slate-200 mt-2 max-w-md">
                {activeSection.description}
              </p>
              <Link
                href={`/shop?category=${activeSection.name}`}
                className="flex items-center gap-2 text-white font-semibold mt-4 group"
              >
                View Collection
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Link>
            </div>
          </div>

          {/* --- UPDATED Right Side Boxes --- */}
          {/* 1. Made it wider with lg:w-3/5 to fill the remaining space */}
          <div className="w-full lg:w-3/5 grid grid-cols-2 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-2 flex items-center justify-center h-full">
                <p className="text-slate-500">
                  No products found for this theme yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ThemedSections;
