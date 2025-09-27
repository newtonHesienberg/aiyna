"use client";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import ShopSidebar from "@/components/ShopSidebar";

// This component now contains all the logic and is the main export.
function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const products = useSelector((state) => state.product.list);

  // Read initial filters from URL
  const initialCategory = searchParams.get("category") || "";
  const initialSubCategory = searchParams.get("subCategory") || "";
  const search = searchParams.get("search") || "";

  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    price: 500,
    color: "",
    size: "",
    categories: initialCategory ? [initialCategory] : [],
    subCategories: initialSubCategory ? [initialSubCategory] : [],
  });
  const [filteredProducts, setFilteredProducts] = useState(products);

  const allColors = [...new Set(products.flatMap((p) => p.colors || []))];
  const allSizes = [...new Set(products.flatMap((p) => p.sizes || []))];

  // Effect to update filters if URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const subCategoryFromUrl = searchParams.get("subCategory");

    setFilters((prevFilters) => ({
      ...prevFilters,
      categories: categoryFromUrl ? [categoryFromUrl] : [],
      subCategories: subCategoryFromUrl ? [subCategoryFromUrl] : [],
    }));
  }, [searchParams]);

  // Effect to apply filters and sorting
  useEffect(() => {
    let tempProducts = [...products];

    if (search) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    tempProducts = tempProducts.filter((product) => {
      const priceMatch = product.price <= filters.price;
      const colorMatch =
        !filters.color ||
        (product.colors && product.colors.includes(filters.color));
      const sizeMatch =
        !filters.size ||
        (product.sizes && product.sizes.includes(filters.size));
      const subCategoryMatch =
        filters.subCategories.length === 0 ||
        filters.subCategories.includes(product.category);

      return priceMatch && colorMatch && sizeMatch && subCategoryMatch;
    });

    if (sort === "newest") {
      tempProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "price-asc") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      tempProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempProducts);
  }, [search, products, filters, sort]);

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto my-10 flex flex-col md:flex-row gap-8">
        <ShopSidebar
          allColors={allColors}
          allSizes={allSizes}
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
        <div className="flex-1">
          <h1
            onClick={() => router.push("/shop")}
            className="text-2xl text-slate-500 mb-6 flex items-center gap-2 cursor-pointer"
          >
            {search && <MoveLeftIcon size={20} />} All{" "}
            <span className="text-slate-700 font-medium">Products</span>
          </h1>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 mx-auto mb-32">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl text-slate-600">No products found</h2>
              <p className="text-slate-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// The Suspense wrapper ensures the page correctly handles loading states
// while using client-side hooks like useSearchParams.
export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
