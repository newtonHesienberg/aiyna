'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether"; 

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState(null); // Initialize product as null
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [productId]);

    if (loading) {
        // You might want to return a loading spinner here
        return <div>Loading...</div>;
    }

    if (error) {
        // You might want to return an error message here
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs */}
                <div className="text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.subCategory?.category?.name} / {product?.subCategory?.name}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}

                {/* "Frequently Bought Together" component */}
                {product && (<FrequentlyBoughtTogether currentProduct={product} />)}
            </div>
        </div>
    );
}