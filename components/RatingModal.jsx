'use client'

import { Star, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { submitRating } from '../lib/features/rating/ratingSlice';

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            throw new Error('Please select a rating between 1 and 5.');
        }
        if (review.length < 5) {
            throw new Error('Please write a short review (at least 5 characters).');
        }

        const { productId } = ratingModal;
        
        const resultAction = await dispatch(submitRating({ productId, rating, reviewText: review }));
        
        if (submitRating.fulfilled.match(resultAction)) {
            setRatingModal(null);
            // Toast will be handled by the promise wrapper
        } else {
            if (resultAction.payload) {
                throw new Error(resultAction.payload);
            } else {
                throw new Error('Failed to submit review.');
            }
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer transition-colors ${rating > i ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
                            fill={rating > i ? "currentColor" : "none"}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    placeholder='Write your review here...'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button 
                    onClick={() => toast.promise(handleSubmit(), { 
                        loading: 'Submitting review...',
                        success: 'Thank you for your feedback!',
                        error: (err) => err.toString(),
                     })} 
                    className='w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition'
                >
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal