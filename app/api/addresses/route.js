import { NextResponse } from 'next/server';
import validateUser from '@/app/src/middleware/validateUser';

// Dummy data - in a real app, you'd fetch this from a database based on the user's ID
let addresses = [
    { id: 1, name: 'Home', address: '123 Maple St, Springfield, IL, 62704', phone: '555-123-4567' },
    { id: 2, name: 'Work', address: '456 Oak Ave, Springfield, IL, 62704', phone: '555-987-6543' },
];

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for the authenticated user
 */
const getAddressesHandler = async (req) => {
    // The user object (e.g., req.user.uid) is available here if you need it
    // to fetch user-specific data from your database.
    return NextResponse.json(addresses);
};

// Wrap the handler with the validation middleware
export const GET = validateUser(getAddressesHandler);