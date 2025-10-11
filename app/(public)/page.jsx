"use client";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import ThemedSections from "@/components/ThemedSections";
import CategoriesMarquee from "@/components/CategoriesMarquee"; // Import CategoriesMarquee
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCategories } from "@/lib/features/category/categorySlice";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      {/* Categories Marquee displayed below the Hero component */}
      <CategoriesMarquee /> 
      <LatestProducts />
      <BestSelling />
      {/* 3. Theme section should be below best selling and latest product */}
      <ThemedSections /> 
      <OurSpecs />
      <Newsletter />
    </div>
  );
}