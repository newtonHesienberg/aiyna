import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for the authenticated user
 * @access  Private
 */
const getAddressesHandler = async (req) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;

        const addresses = await db.Address.findAll({ where: { user_id: userId } });
        return NextResponse.json(addresses);

    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ error: 'Failed to fetch addresses.' }, { status: 500 });
    }
};

/**
 * @route   POST /api/addresses
 * @desc    Create a new address for the authenticated user
 * @access  Private
 */
const createAddressHandler = async (req) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const body = await req.json();

        // Add user_id to the data before creating
        const addressData = { ...body, user_id: userId };

        const newAddress = await db.Address.create(addressData);
        return NextResponse.json(newAddress, { status: 201 });

    } catch (error) {
        console.error('Error creating address:', error);
        return NextResponse.json({ error: 'Failed to create address.' }, { status: 500 });
    }
};

export const GET = validateUser(getAddressesHandler);
export const POST = validateUser(createAddressHandler);
