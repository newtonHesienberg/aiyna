import { NextResponse } from 'next/server';
import ThemeSection from '@/app/src/db/models/themesection';
import SubCategory from '@/app/src/db/models/subcategory';
import Product from '@/app/src/db/models/Product';
import Rating from '@/app/src/db/models/rating';

/**
 * @route   GET /api/themes
 * @desc    Get all theme sections with their associated subcategories and products.
 * @access  Public
 */
export async function GET(req) {
    try {
        
        const themeSections = await ThemeSection.findAll({
            where: { isActive: true },
            include: [
                {
                    model: SubCategory,
                    as: 'subCategories',
                    include: [
                        {
                            model: Product,
                            as: 'products',
                            limit: 4, // Limit to 4 products per sub-category for the theme view
                            order: [['created_at', 'DESC']],
                            include: [ // Include ratings for product cards
                                {
                                    model: Rating,
                                    as: 'ratings',
                                    attributes: ['rating']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // We need to aggregate products from all subcategories under a theme
        const processedSections = themeSections.map(section => {
            const allProducts = section.subCategories.flatMap(sub => sub.products);
            // Sort all aggregated products by creation date and take the top 4
            const latestProducts = allProducts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 4);

            return {
                id: section.id,
                name: section.name,
                title: section.title,
                description: section.description,
                imageUrl: section.imageUrl,
                // We send only the products to the frontend for this component
                products: latestProducts
            };
        });

        return NextResponse.json(processedSections);
    } catch (error) {
        console.error('Error fetching theme sections:', error);
        return NextResponse.json({ error: 'Failed to fetch theme sections.' }, { status: 500 });
    }
}
