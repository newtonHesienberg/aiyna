'use client'
import Link from "next/link";
import { useSelector } from "react-redux";

const CategoriesMarquee = () => {

    const { list: categoryData } = useSelector((state) => state.category);

    // Create a single flat array of all sub-categories from our main category data
    const allSubCategories = categoryData.flatMap(category => category.subCategories.map(sub => ({
        name: sub.name,
        path: `/shop?subCategory=${sub.name}`
    })));

    return (
        <div className="overflow-hidden w-full relative select-none group mt-3 sm:my-10 mb-6">
            {/* Added horizontal padding to the scroll container to give it space, 
                and increased blur size for a smoother fade effect. */}
            <div className="absolute left-0 top-0 h-full w-10 sm:w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            
            {/* The flex container for the scrolling items */}
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4 px-6 sm:px-12" >
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
