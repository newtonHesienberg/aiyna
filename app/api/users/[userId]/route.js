import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import { Op } from 'sequelize';
import validateUser from '@/app/src/middleware/validateUser';
import User from '@/app/src/db/models/User';

const getUserHandler = async (request, { params }) => {
    try {
        
        const {userId}  = await params;
        const user = await User.findOne({
            where: {
                id: {
                    [Op.eq]: userId
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

const updateUserHandler = async (request, { params }) => {
    try {
        
        const { userId } = await params;
        const body = await request.json();

        const user = await User.findOne({
            where: {
                id: {
                    [Op.eq]: userId
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        // Update the user with the new data
        await user.update(body);

        return NextResponse.json({ message: 'User updated successfully', user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const GET = validateUser(getUserHandler);
export const PATCH = validateUser(updateUserHandler);