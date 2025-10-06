import Category from '@/app/src/db/models/category';
import SubCategory from '@/app/src/db/models/subcategory';
import { NextResponse } from 'next/server';

/**
 * @route   GET /api/categories
 * @desc    Get all categories with their subcategories
 * @access  Public
 */
export async function GET(req) {
    try {
        
        const categories = await Category.findAll({
            include: [{
                model: SubCategory,
                as: 'subCategories'
            }],
            order: [
                ['name', 'ASC'],
                [{ model: SubCategory, as: 'subCategories' }, 'name', 'ASC'],
            ],
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
    }
}
