'use client'
import { categoryData } from "@/assets/assets";
import Link from "next/link";

const CategoriesMarquee = () => {

    // Create a single flat array of all sub-categories from our main category data
    const allSubCategories = categoryData.flatMap(category => category.subCategories);

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4" >
                {/* We duplicate the array to ensure the marquee has enough items to scroll smoothly */}
                {[...allSubCategories, ...allSubCategories, ...allSubCategories, ...allSubCategories].map((subCategory, index) => (
                    <Link 
                        href={subCategory.path}
                        key={`${subCategory.name}-${index}`} 
                        className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300 whitespace-nowrap"
                    >
                        {subCategory.name}
                    </Link>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;