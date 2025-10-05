import { NextResponse } from 'next/server';
import dbPromise from '../../src/db/models';
import validateUser from '../../src/middleware/validateUser';

/**
 * @route   POST /api/ratings
 * @desc    Create or update a rating for a product
 * @access  Private
 */
const postRatingHandler = async (req) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const { productId, rating, reviewText } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json({ error: 'Product ID and rating are required.' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
        }

        // Find if a rating already exists for this user and product
        let existingRating = await db.Rating.findOne({
            where: {
                userId: userId,
                productId: productId
            }
        });

        let savedRating;
        if (existingRating) {
            // Update the existing rating
            existingRating.rating = rating;
            existingRating.reviewText = reviewText;
            savedRating = await existingRating.save();
        } else {
            // Create a new rating if one doesn't exist
            savedRating = await db.Rating.create({
                userId,
                productId,
                rating,
                reviewText
            });
        }

        return NextResponse.json(savedRating, { status: 201 });

    } catch (error) {
        console.error('Error creating/updating rating:', error);
        return NextResponse.json({ error: 'Failed to submit rating.' }, { status: 500 });
    }
};

export const POST = validateUser(postRatingHandler);
