import Category from '@/app/src/db/models/category';
import Product from '@/app/src/db/models/Product';
import ProductVariant from '@/app/src/db/models/productvariant';
import Rating from '@/app/src/db/models/rating';
import Spec from '@/app/src/db/models/spec';
import SubCategory from '@/app/src/db/models/subcategory';
import { NextResponse } from 'next/server';
const db = require('@/app/src/db/models');


/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and associations
 * @access  Public
 */
export async function GET(req) {
    try {
        
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
            limit,
            offset,
            include: [
                // These are `belongsTo` or `hasOne` associations, which are fine.
                {
                    model: SubCategory,
                    as: 'subCategory',
                    include: [{ model: Category, as: 'category' }]
                },
                // These are `hasMany` associations, which can cause count issues.
                { model: Spec, as: 'specs' },
                { model: ProductVariant, as: 'variants' },
                {
                    model: Rating,
                    as: 'ratings',
                    required: false // FIX: Changed `require` to `required: false` for a LEFT JOIN.
                }
            ],
            distinct: true, // This is crucial for counting distinct Products instead of total rows.
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
    
    const transaction = await db.sequelize.transaction();

    try {
        const { product, specs, variants } = await req.json();

        // Create the main product record
        const newProduct = await Product.create(product, { transaction });

        // If specs are provided, bulk create them
        if (specs && specs.length > 0) {
            const specData = specs.map(spec => ({ ...spec, product_id: newProduct.id }));
            await Spec.bulkCreate(specData, { transaction });
        }

        // If variants are provided, bulk create them
        if (variants && variants.length > 0) {
            const variantData = variants.map(variant => ({ ...variant, product_id: newProduct.id }));
            await ProductVariant.bulkCreate(variantData, { transaction });
        }

        await transaction.commit();

        // Refetch the created product with all its associations to return it
        const result = await Product.findByPk(newProduct.id, {
            include: [
                { model: SubCategory, as: 'subCategory', include: [{ model: Category, as: 'category' }] },
                { model: Spec, as: 'specs' },
                { model: ProductVariant, as: 'variants' }
            ]
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
    }
}
