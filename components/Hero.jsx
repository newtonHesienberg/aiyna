'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    return (
        <div>
            <div className='flex max-xl:flex-col gap-8 w-full my-10 px-6 lg:px-12'>
                {/* Main Hero Banner */}
                 <div className='relative flex-1 flex flex-col bg-slate-100 rounded-3xl group overflow-hidden'>
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-slate-200 text-slate-800 pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-slate-800 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEW</span> Get Your Personalized AI Style Report! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-4 font-medium bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Your Style, Reimagined by AI.
                        </h2>
                        <p className='text-slate-600 max-w-md mt-2'>
                            Discover clothing that truly fits you. Our AI finds your perfect style from thousands of collections.
                        </p>
                        <button className='bg-slate-800 text-white text-sm py-3 px-8 sm:py-4 sm:px-12 mt-8 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>
                            Discover Your Style
                        </button>
                    </div>
                    {/* IMPORTANT: Replace with your fashion model image */}
                    <Image
                        className='sm:absolute bottom-1 right-0 md:right-0 w-full sm:max-w-sm'
                        src={assets.hero_model_2} // Change this to your new image asset
                        alt="Fashion Model"
                    />
                </div>

                {/* Side Banners */}
                <div className='flex flex-col gap-5 w-full xl:max-w-xs text-sm text-slate-700'>
                    <div className='flex-1 flex items-center justify-between w-full bg-purple-100 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#B38CFF] bg-clip-text text-transparent max-w-40'>Curated For You</p>
                            <p className='flex items-center gap-1 mt-4'>Explore now <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        {/* IMPORTANT: Replace with a product/collection image */}
                        <Image className='w-35' src={assets.mens_Tshirt_1} alt="Stylish clothing" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-sky-100 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>New Arrivals</p>
                            <p className='flex items-center gap-1 mt-4'>Shop the collection <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        {/* IMPORTANT: Replace with another product/collection image */}
                        <Image className='w-35' src={assets.mens_Hoody_1} alt="New fashion arrivals" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero