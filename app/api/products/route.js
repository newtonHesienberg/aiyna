import { NextResponse } from 'next/server';
import dbPromise from '@/app/src/db/models';
import { Op } from 'sequelize';

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and associations
 * @access  Public
 */
export async function GET(req) {
    try {
        const db = await dbPromise;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await db.Product.findAndCountAll({
            limit,
            offset,
            include: [
                { model: db.SubCategory, as: 'subCategory', include: [{ model: db.Category, as: 'category' }] },
                { model: db.Spec, as: 'specs' },
                { model: db.ProductVariant, as: 'variants' },
                { model: db.Rating, as: 'ratings' } // Also including ratings
            ],
            distinct: true // Important for correct counting with includes
        });

        return NextResponse.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            products: rows
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
    }
}


/**
 * @route   POST /api/products
 * @desc    Create a new product with specs and variants
 * @access  Private (should be admin-only)
 */
export async function POST(req) {
    const db = await dbPromise;
    const transaction = await db.sequelize.transaction();

    try {
        const { product, specs, variants } = await req.json();

        // Create the main product record
        const newProduct = await db.Product.create(product, { transaction });

        // If specs are provided, bulk create them
        if (specs && specs.length > 0) {
            const specData = specs.map(spec => ({ ...spec, product_id: newProduct.id }));
            await db.Spec.bulkCreate(specData, { transaction });
        }

        // If variants are provided, bulk create them
        if (variants && variants.length > 0) {
            const variantData = variants.map(variant => ({ ...variant, product_id: newProduct.id }));
            await db.ProductVariant.bulkCreate(variantData, { transaction });
        }

        await transaction.commit();

        // Refetch the created product with all its associations to return it
        const result = await db.Product.findByPk(newProduct.id, {
             include: [
                { model: db.SubCategory, as: 'subCategory', include: [{ model: db.Category, as: 'category' }] },
                { model: db.Spec, as: 'specs' },
                { model: db.ProductVariant, as: 'variants' }
            ]
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
    }
}
