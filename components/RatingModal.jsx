'use client'

import { Star, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addRating, updateRating } from '../lib/features/rating/ratingSlice';

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const { productId, existingRating, existingReview, isEditing } = ratingModal;

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (isEditing) {
            setRating(existingRating || 0);
            setReview(existingReview || '');
        }
    }, [isEditing, existingRating, existingReview]);


    const handleSubmit = () => {
        if (rating < 1 || rating > 5) {
            toast.error('Please select a star rating.');
            return; 
        }
        if (review.length < 5) {
            toast.error('Please write a short review (at least 5 characters).');
            return;
        }

        const action = isEditing
            ? updateRating({ productId, rating, reviewText: review })
            : addRating({ productId, rating, reviewText: review });

        const promise = dispatch(action).unwrap();

        toast.promise(promise, {
            loading: isEditing ? 'Updating review...' : 'Submitting review...',
            success: isEditing ? 'Review updated successfully!' : 'Thank you for your review!',
            error: (err) => err || 'An error occurred.',
        });

        setRatingModal(null);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'>
                    <XIcon size={24} />
                </button>
                <h2 className='text-xl font-semibold text-slate-800 mb-4'>{isEditing ? 'Edit Your Review' : 'Rate Product'}</h2>
                <div className='flex items-center justify-center mb-6'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-9 cursor-pointer transition-colors ${rating > i ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    placeholder='Share your thoughts about the product...'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={handleSubmit} className='w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition'>
                    {isEditing ? 'Update Review' : 'Submit Review'}
                </button>
            </div>
        </div>
    )
}

export default RatingModal