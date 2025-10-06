import { NextResponse } from 'next/server';
import validateUser from '@/app/src/middleware/validateUser';
import { Op } from 'sequelize';
import Address from '@/app/src/db/models/address';

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for the authenticated user
 * @access  Private
 */
const getAddressesHandler = async (req) => {
    try {
        
        const addresses = await Address.findAll({
            where: {
                userId: {
                    [Op.eq]: req.user.uid
                }
            }
        });
        return NextResponse.json(addresses);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

/**
 * @route   POST /api/addresses
 * @desc    Create a new address for the authenticated user
 */
const postAddressesHandler = async (req) => {
    try {
        
        const body = await req.json();

        // Validate required fields
        const { name, street, city, state, zipCode, country, phone } = body;
        if (!name || !street || !city || !state || !zipCode || !country) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const newAddress = await Address.create({
            userId: req.user.uid,
            name,
            street,
            city,
            state,
            zipCode,
            country,
            phone
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


// Wrap the handlers with the validation middleware
export const GET = validateUser(getAddressesHandler);
export const POST = validateUser(postAddressesHandler);