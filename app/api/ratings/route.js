import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';
import { Op } from 'sequelize';
import Rating from '@/app/src/db/models/rating';

/**
 * @route   POST /api/ratings
 * @desc    Create a new rating for a product
 * @access  Private
 */
const addRatingHandler = async (req) => {
    try {
        
        const userId = req.user.uid;
        const { productId, rating, reviewText } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json({ error: 'Product ID and rating are required.' }, { status: 400 });
        }

        // Use findOrCreate to prevent duplicate reviews by the same user for the same product
        const [newRating, created] = await Rating.findOrCreate({
            where: {
                userId: userId,
                productId: productId
            },
            defaults: {
                userId,
                productId,
                rating,
                reviewText
            }
        });

        if (!created) {
            return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 });
        }

        return NextResponse.json(newRating, { status: 201 });

    } catch (error) {
        console.error('Error creating rating:', error);
        return NextResponse.json({ error: 'Failed to create rating.' }, { status: 500 });
    }
};


/**
 * @route   PUT /api/ratings
 * @desc    Update an existing rating for a product
 * @access  Private
 */
const updateRatingHandler = async (req) => {
    try {
        
        const userId = req.user.uid;
        const { productId, rating, reviewText } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json({ error: 'Product ID and rating are required.' }, { status: 400 });
        }

        const existingRating = await Rating.findOne({
            where: {
                userId: { [Op.eq]: userId },
                productId: { [Op.eq]: productId }
            }
        });

        if (!existingRating) {
            return NextResponse.json({ error: 'Rating not found. You can only edit your own reviews.' }, { status: 404 });
        }

        // Update the fields
        existingRating.rating = rating;
        existingRating.reviewText = reviewText;

        // Save the changes
        await existingRating.save();

        // **THE FIX**: Return the updated rating object as a JSON response
        return NextResponse.json(existingRating, { status: 200 });

    } catch (error) {
        console.error('Error updating rating:', error);
        return NextResponse.json({ error: 'Failed to update rating.' }, { status: 500 });
    }
};

export const POST = validateUser(addRatingHandler);
export const PUT = validateUser(updateRatingHandler);
