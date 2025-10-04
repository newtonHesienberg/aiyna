"use client";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import ThemedSections from "@/components/ThemedSections";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <ThemedSections />
      <LatestProducts />
      <BestSelling />
      <OurSpecs />
      <Newsletter />
    </div>
  );
}