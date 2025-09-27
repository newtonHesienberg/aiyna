"use client";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import AiDesigner from "@/components/AiDesigner";
import ThemedSections from "@/components/ThemedSections"; // 1. Import the new component

export default function Home() {
  return (
    <div>
      <Hero />
      <ThemedSections /> {/* 2. Add the component here */}
      <LatestProducts />
      <BestSelling />
      <OurSpecs />
      <Newsletter />
    </div>
  );
}
