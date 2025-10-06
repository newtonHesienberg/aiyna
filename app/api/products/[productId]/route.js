import { NextResponse } from 'next/server';
import Product from '@/app/src/db/models/Product';
import SubCategory from '@/app/src/db/models/subcategory';
import Category from '@/app/src/db/models/category';
import Spec from '@/app/src/db/models/spec';
import ProductVariant from '@/app/src/db/models/productvariant';
import Rating from '@/app/src/db/models/rating';
import User from '@/app/src/db/models/User';
const db = require('@/app/src/db/models');


/**
 * @route   GET /api/products/[productId]
 * @desc    Get a single product by its ID with all associations
 * @access  Public
 */
export async function GET(req, { params }) {
    try {
        
        const { productId } = await params;

        const product = await Product.findByPk(productId, {
            include: [
                { model: SubCategory, as: 'subCategory', include: [{ model: Category, as: 'category' }] },
                { model: Spec, as: 'specs' },
                { model: ProductVariant, as: 'variants' },
                { 
                    model: Rating, 
                    as: 'ratings',
                    include: [{ 
                        model: User, 
                        as: 'user', 
                        attributes: ['firstName', 'lastName', 'profileImage'] 
                    }] 
                }
            ]
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
    }
}

/**
 * @route   PUT /api/products/[productId]
 * @desc    Update a product, its specs, and variants
 * @access  Private (should be admin-only)
 */
export async function PUT(req, { params }) {
    
    const { productId } = await params;
    const transaction = await db.sequelize.transaction();

    try {
        const { product: productData, specs, variants } = await req.json();

        const product = await Product.findByPk(productId);
        if (!product) {
            await transaction.rollback();
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        // 1. Update the main product details
        await product.update(productData, { transaction });

        // 2. Replace specs
        await Spec.destroy({ where: { product_id: productId }, transaction });
        if (specs && specs.length > 0) {
            const specData = specs.map(spec => ({ ...spec, product_id: productId }));
            await Spec.bulkCreate(specData, { transaction });
        }

        // 3. Replace variants
        await ProductVariant.destroy({ where: { product_id: productId }, transaction });
        if (variants && variants.length > 0) {
            const variantData = variants.map(variant => ({ ...variant, product_id: productId }));
            await ProductVariant.bulkCreate(variantData, { transaction });
        }
        
        await transaction.commit();

        // Refetch the updated product with all its associations
        const updatedProduct = await Product.findByPk(productId, {
            include: [
                { model: SubCategory, as: 'subCategory', include: [{ model: Category, as: 'category' }] },
                { model: Spec, as: 'specs' },
                { model: ProductVariant, as: 'variants' }
            ]
        });

        return NextResponse.json(updatedProduct);

    } catch (error) {
        await transaction.rollback();
        console.error(`Error updating product ${productId}:`, error);
        return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
    }
}

/**
 * @route   DELETE /api/products/[productId]
 * @desc    Delete a product by its ID
 * @access  Private (should be admin-only)
 */
export async function DELETE(req, { params }) {
    try {
        
        const { productId } = await params;

        const product = await Product.findByPk(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        await product.destroy(); // Thanks to `onDelete: 'CASCADE'`, related specs/variants will also be deleted.

        return NextResponse.json({ message: 'Product successfully deleted.' });

    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
    }
}
