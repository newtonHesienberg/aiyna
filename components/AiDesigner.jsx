'use client'
import { ClipboardPenLine, UserCheck } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image' // 1. Import the Image component
import { assets } from '@/assets/assets' // 2. Import your assets

const AiDesigner = () => {
    const router = useRouter();

    return (
        <div className='mx-6 my-20'> 
            {/* 3. Main container is now a flexbox */}
            <div className='max-w-6xl mx-auto bg-blue-100 rounded-3xl flex flex-col md:flex-row items-center overflow-hidden'>
                {/* 4. Container for all the text content */}
                <div className='flex-1 p-8 sm:p-12 text-center md:text-left items-center md:items-start flex flex-col'>
                    <h2 className='text-3xl sm:text-4xl font-semibold text-slate-800'>Personalized AI-Generated Designs</h2>
                    <p className='text-slate-600 mt-4 max-w-2xl'>
                        Unleash your creativity. Our AI understands your personality to design a one-of-a-kind product just for you.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                        <button 
                            onClick={() => router.push('/quiz')} 
                            className='flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-transform active:scale-95'
                        >
                            <UserCheck size={20} />
                            Take the Personality Quiz
                        </button>
                        <button 
                            onClick={() => router.push('/create-by-prompt')} 
                            className='flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-700 font-medium py-3 px-8 rounded-full border border-slate-300 transition-transform active:scale-95'
                        >
                            <ClipboardPenLine size={20} />
                            Create From a Prompt
                        </button>
                    </div>
                </div>
                {/* 5. Container for the image */}
                <div className='flex-1 w-full h-full hidden md:flex items-end justify-center'>
                    <Image
                        src={assets.hero_model_2} // Using an existing, relevant image
                        alt="AI Designer Model"
                        width={400}
                        height={400}
                        className='object-contain mt-auto'
                    />
                </div>
            </div>
        </div>
    )
}

export default AiDesigner;