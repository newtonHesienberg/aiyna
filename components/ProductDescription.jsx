'use client'
import { ArrowRight, StarIcon, Edit2Icon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../app/context/AuthContext";
import RatingModal from "./RatingModal";
import { assets } from "@/assets/assets"

const ProductDescription = ({ product }) => {
    const { currentUser } = useAuth();
    const [selectedTab, setSelectedTab] = useState('Description');
    const [ratingModal, setRatingModal] = useState(null);

    const store = {
        name: "Qikink",
        username: "qikink",
        logo: assets.gs_logo
    };
    
    const handleEditReview = (rating) => {
        setRatingModal({
            productId: product.id,
            existingRating: rating.rating,
            existingReview: rating.reviewText,
            isEditing: true
        });
    }

    return (
        <>
            <div className="my-12 text-sm text-slate-600">

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-8 max-w-2xl">
                    {['Description', `Reviews (${product?.ratings?.length || 0})`, 'Seller Info'].map((tab, index) => (
                        <button className={`${tab.startsWith(selectedTab) ? 'border-b-2 border-indigo-600 font-semibold text-indigo-600' : 'text-slate-400'} px-4 py-2 font-medium transition-colors`} key={index} onClick={() => setSelectedTab(tab.split(' ')[0])}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Description */}
                {selectedTab === "Description" && (
                    <div className="prose prose-slate max-w-xl">
                        <p>{product.description}</p>
                    </div>
                )}
                {/* Reviews */}
                {selectedTab === "Reviews" && (
                    <div className="flex flex-col gap-8 mt-8 max-w-2xl">
                        {product.ratings && product.ratings.length > 0 ? product.ratings.map((item, index) => (
                            <div key={index} className="flex gap-4 border-b border-slate-100 pb-6">
                                <Image src={item?.user?.profileImage || assets.generic_profile_image || 'https://placehold.co/100x100/EFEFEF/31343C?text=User'} alt={item?.user?.firstName || 'User'} className="size-10 rounded-full" width={40} height={40} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-800">{item?.user?.firstName} {item?.user?.lastName}</p>
                                            <div className="flex items-center mt-1" >
                                                {Array(5).fill('').map((_, index) => (
                                                    <StarIcon key={index} size={16} className='text-transparent' fill={item?.rating >= index + 1 ? "#f59e0b" : "#D1D5DB"} />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Edit Button for the current user's review */}
                                        {currentUser && item?.userId === currentUser.uid && (
                                            <button onClick={() => handleEditReview(item)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
                                                <Edit2Icon size={16} />
                                                <span>Edit</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-700 my-3 leading-relaxed">{item?.reviewText}</p>
                                    <p className="text-xs text-slate-400">{new Date(item?.updated_at).toDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p>No reviews yet. Be the first to write one!</p>
                        )}
                    </div>
                )}
                {/* Seller Info */}
                {selectedTab === "Seller" && (
                    <div className="flex items-center gap-4">
                        <Image src={store.logo} alt={store.name} width={64} height={64} className="size-16 rounded-full" />
                        <div>
                            <p className="font-semibold text-slate-800">{store.name}</p>
                            <Link href={`/shop/${store.username}`} className="text-indigo-600 text-sm flex items-center gap-1">
                                Visit Store <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </>
    )
}

export default ProductDescription;