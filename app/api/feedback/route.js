import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback for the authenticated user.
 * @access  Private
 */
const postFeedbackHandler = async (req) => {
    try {
        // The user's ID is available via `req.user.uid` from the middleware
        const userId = req.user.uid;
        const { subject, message } = await req.json();

        // Validate required fields
        if (!message) {
            return NextResponse.json({ error: 'The message field is required.' }, { status: 400 });
        }

        const db = await dbPromise;
        const newFeedback = await db.Feedback.create({
            userId,
            subject,
            message,
        });

        return NextResponse.json(newFeedback, { status: 201 });

    } catch (error) {
        console.error('Error creating feedback:', error);
        return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
    }
};

// Wrap the handler with the validation middleware
export const POST = validateUser(postFeedbackHandler);