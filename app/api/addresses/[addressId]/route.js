import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import validateUser from '@/app/src/middleware/validateUser';
import Address from '@/app/src/db/models/address';

const getAddressHandler = async (request, { params }) => {
    try {
        
        const { addressId } = await params;

        const address = await Address.findOne({
            where: {
                id: {
                    [Op.eq]: addressId
                },
                userId: {
                    [Op.eq]: request.user.uid
                }
            }
        });

        if (!address) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json(address);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const updateAddressHandler = async (request, { params }) => {
    try {
        
        const { addressId } = await params;
        const body = await request.json();

        const address = await Address.findOne({
            where: {
                id: {
                    [Op.eq]: addressId
                },
                userId: {
                    [Op.eq]: request.user.uid
                }
            }
        });

        if (!address) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        // Update the address with the new data
        await address.update(body);

        return NextResponse.json({ message: 'Address updated successfully', address });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

const deleteAddressHandler = async (request, { params }) => {
    try {
        
        const { addressId } = await params;

        const address = await Address.findOne({
            where: {
                id: {
                    [Op.eq]: addressId
                },
                userId: {
                    [Op.eq]: request.user.uid
                }
            }
        });

        if (!address) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        await address.destroy();

        return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const GET = validateUser(getAddressHandler)
export const PATCH = validateUser(updateAddressHandler);
export const DELETE = validateUser(deleteAddressHandler);