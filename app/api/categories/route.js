import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';

/**
 * @route   GET /api/categories
 * @desc    Get all categories with their subcategories
 * @access  Public
 */
export async function GET(req) {
    try {
        const db = await dbPromise;
        const categories = await db.Category.findAll({
            include: [{
                model: db.SubCategory,
                as: 'subCategories'
            }],
            order: [
                ['name', 'ASC'],
                [{ model: db.SubCategory, as: 'subCategories' }, 'name', 'ASC'],
            ],
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
    }
}
