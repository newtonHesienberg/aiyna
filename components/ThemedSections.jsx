"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Loading from "./Loading"; // Import a loading component

const ThemedSections = () => {
  const [activeTab, setActiveTab] = useState('');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('/api/themes');
        if (!response.ok) {
          throw new Error('Failed to fetch themes');
        }
        const data = await response.json();
        setSections(data);
        if (data.length > 0) {
          setActiveTab(data[0].name);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const activeSection = sections.find(
    (section) => section.name === activeTab
  );

  if (loading) {
    return <div className="min-h-[730px] flex items-center justify-center"><Loading /></div>;
  }
  
  if (!activeSection) {
      return null;
  }

  return (
    <div className="px-6 lg:px-12 my-20">
        {/* Tabs */}
        <div className="flex justify-center gap-4 sm:gap-8 border-b border-slate-200 mb-8">
          {sections.map((section) => (
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
          {/* Left Box */}
          <div className="relative w-full lg:w-2/5 h-[730px] rounded-2xl overflow-hidden group">
            <Image
              src={activeSection.imageUrl}
              alt={`${activeSection.name} Themed Products`}
              fill
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
                href={`/shop?theme=${activeSection.name}`} // Link to a filtered shop page by theme
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

          {/* Right Side Boxes */}
          <div className="w-full lg:w-3/5 grid grid-cols-2 gap-6">
            {activeSection.products && activeSection.products.length > 0 ? (
              activeSection.products.map((product) => (
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