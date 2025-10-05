import { NextResponse } from 'next/server';
import dbPromise from '../../src/db/models';
import { Op } from 'sequelize';

/**
 * @route   GET /api/products/[productId]
 * @desc    Get a single product by its ID with all associations
 * @access  Public
 */
export async function GET(req, { params }) {
    try {
        const db = await dbPromise;
        const { productId } = await params;

        const product = await db.Product.findByPk(productId, {
            include: [
                { model: db.SubCategory, as: 'subCategory', include: [{ model: db.Category, as: 'category' }] },
                { model: db.Spec, as: 'specs' },
                { model: db.ProductVariant, as: 'variants' },
                { 
                    model: db.Rating, 
                    as: 'ratings',
                    include: [{ 
                        model: db.User, 
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
    const db = await dbPromise;
    const { productId } = await params;
    const transaction = await db.sequelize.transaction();

    try {
        const { product: productData, specs, variants } = await req.json();

        const product = await db.Product.findByPk(productId);
        if (!product) {
            await transaction.rollback();
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        // 1. Update the main product details
        await product.update(productData, { transaction });

        // 2. Replace specs
        await db.Spec.destroy({ where: { product_id: productId }, transaction });
        if (specs && specs.length > 0) {
            const specData = specs.map(spec => ({ ...spec, product_id: productId }));
            await db.Spec.bulkCreate(specData, { transaction });
        }

        // 3. Replace variants
        await db.ProductVariant.destroy({ where: { product_id: productId }, transaction });
        if (variants && variants.length > 0) {
            const variantData = variants.map(variant => ({ ...variant, product_id: productId }));
            await db.ProductVariant.bulkCreate(variantData, { transaction });
        }
        
        await transaction.commit();

        // Refetch the updated product with all its associations
        const updatedProduct = await db.Product.findByPk(productId, {
            include: [
                { model: db.SubCategory, as: 'subCategory', include: [{ model: db.Category, as: 'category' }] },
                { model: db.Spec, as: 'specs' },
                { model: db.ProductVariant, as: 'variants' }
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
        const db = await dbPromise;
        const { productId } = await params;

        const product = await db.Product.findByPk(productId);
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
