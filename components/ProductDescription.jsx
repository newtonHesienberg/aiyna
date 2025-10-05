'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { assets } from "@/assets/assets"; 

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')

    // Hardcoded store information
    const store = {
        name: "Qikink",
        username: "qikink",
        logo: assets.gs_logo // Using a placeholder logo from your assets
    };


    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', `Reviews (${product.ratings?.length || 0})`].map((tab, index) => (
                    <button className={`${tab.startsWith(selectedTab) ? 'border-b-2 border-indigo-600 font-semibold text-slate-800' : 'text-slate-400'} px-3 py-2 font-medium transition-colors`} key={index} onClick={() => setSelectedTab(tab.split(' ')[0])}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl leading-relaxed">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-8 max-w-2xl">
                    {product.ratings && product.ratings.length > 0 ? [...product.ratings].reverse().map((item,index) => (
                        <div key={index} className="flex gap-5 py-6 border-b border-slate-100">
                            <Image src={item.user?.profileImage || assets.profile_pic1} alt={item.user?.firstName || 'User'} className="size-10 rounded-full object-cover" width={40} height={40} />
                            <div>
                                <p className="font-medium text-slate-800">{item.user?.firstName} {item.user?.lastName}</p>
                                <div className="flex items-center my-1" >
                                    {Array(5).fill('').map((_, i) => (
                                        <StarIcon key={i} size={16} className='text-transparent' fill={item.rating >= i + 1 ? "#f59e0b" : "#D1D5DB"} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 max-w-lg my-2 leading-relaxed">{item.reviewText}</p>
                                <p className="text-xs text-slate-400 mt-1 font-light">{new Date(item.createdAt).toDateString()}</p>
                            </div>
                        </div>
                    )) : <p>No reviews yet. Be the first to review this product!</p>}
                </div>
            )}
        </div>
    )
}

export default ProductDescription;