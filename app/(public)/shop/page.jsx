"use client";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import ShopSidebar from "@/components/ShopSidebar";
import Loading from "@/components/Loading";

// This component now contains all the logic and is the main export.
function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { list: products, loading: productsLoading } = useSelector((state) => state.product);
  const { list: categoryData, loading: categoriesLoading } = useSelector((state) => state.category);

  // State is now initialized from the URL search params on first load
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [filters, setFilters] = useState({
    price: parseInt(searchParams.get("price") || "500", 10),
    color: searchParams.get("color") || "",
    size: searchParams.get("size") || "",
    categories: searchParams.getAll("category"),
    subCategories: searchParams.getAll("subCategory"),
  });

  const [filteredProducts, setFilteredProducts] = useState(products);
  const search = searchParams.get("search") || "";

  const allColors = [...new Set(products.flatMap((p) => p.variants?.map(v => v.color)).filter(Boolean))];
  const allSizes = [...new Set(products.flatMap((p) => p.variants?.map(v => v.size)).filter(Boolean))];
  
  // This effect syncs filter state changes TO the URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    filters.subCategories.forEach(sub => params.append('subCategory', sub));
    filters.categories.forEach(cat => params.append('category', cat));

    if (filters.color) params.set('color', filters.color);
    if (filters.size) params.set('size', filters.size);
    if (filters.price < 500) params.set('price', filters.price);
    if (sort !== 'newest') params.set('sort', sort);

    // Update URL without a full page reload. Using replace to avoid polluting browser history.
    router.replace(`/shop?${params.toString()}`);
  }, [filters, sort, search, router]);


  // Effect to apply filters and sorting when data or filters change
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
        (product.variants && product.variants.some(v => v.color === filters.color));
      const sizeMatch =
        !filters.size ||
        (product.variants && product.variants.some(v => v.size === filters.size));
      
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.subCategory?.category?.name);

      const subCategoryMatch =
        filters.subCategories.length === 0 ||
        filters.subCategories.includes(product.subCategory?.name);

      return priceMatch && colorMatch && sizeMatch && subCategoryMatch && categoryMatch;
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
  
  if (productsLoading || categoriesLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto my-10 flex flex-col md:flex-row gap-8">
        <ShopSidebar
          allColors={allColors}
          allSizes={allSizes}
          categoryData={categoryData}
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
    <Suspense fallback={<Loading />}>
      <ShopPage />
    </Suspense>
  );
}
