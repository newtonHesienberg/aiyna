import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import validateUser from '@/app/src/middleware/validateUser';
import { Op } from 'sequelize';

/**
 * @route   GET /api/addresses/[addressId]
 * @desc    Get a single address by its ID
 * @access  Private
 */
const getAddressHandler = async (req, { params }) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const { addressId } = params;

        const address = await db.Address.findOne({
            where: { id: addressId, user_id: userId }
        });

        if (!address) {
            return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
        }
        return NextResponse.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        return NextResponse.json({ error: 'Failed to fetch address.' }, { status: 500 });
    }
};


/**
 * @route   PUT /api/addresses/[addressId]
 * @desc    Update an existing address
 * @access  Private
 */
const updateAddressHandler = async (req, { params }) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const { addressId } = params;
        const body = await req.json();

        const address = await db.Address.findOne({
            where: { id: addressId, user_id: userId }
        });

        if (!address) {
            return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
        }

        await address.update(body);
        return NextResponse.json(address);

    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: 'Failed to update address.' }, { status: 500 });
    }
};

/**
 * @route   DELETE /api/addresses/[addressId]
 * @desc    Delete an address
 * @access  Private
 */
const deleteAddressHandler = async (req, { params }) => {
    try {
        const db = await dbPromise;
        const userId = req.user.uid;
        const { addressId } = params;

        const address = await db.Address.findOne({
            where: { id: addressId, user_id: userId }
        });

        if (!address) {
            return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
        }

        await address.destroy();
        return NextResponse.json({ message: 'Address successfully deleted.' });

    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ error: 'Failed to delete address.' }, { status: 500 });
    }
};

export const GET = validateUser(getAddressHandler);
export const PUT = validateUser(updateAddressHandler);
export const DELETE = validateUser(deleteAddressHandler);
