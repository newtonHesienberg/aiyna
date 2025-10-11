"use client";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { FilterIcon, MoveLeftIcon } from "lucide-react"; // Import FilterIcon
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import ShopSidebar from "@/components/ShopSidebar";
import Loading from "@/components/Loading";
import CategoriesMarquee from "@/components/CategoriesMarquee"; // Import CategoriesMarquee

function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { list: products, loading: productsLoading } = useSelector((state) => state.product);
  const { list: categoryData, loading: categoriesLoading } = useSelector((state) => state.category);
  
  // State to manage the visibility of the filter sidebar on mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      tempProducts.sort((a, b) => b.price - b.price);
    }

    setFilteredProducts(tempProducts);
  }, [search, products, filters, sort]);
  
  if (productsLoading || categoriesLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[70vh] mx-6">
        {/* 4. In /shop page, please add categoriesMarquee on top */}
        <CategoriesMarquee /> 

        <div className="max-w-7xl mx-auto my-10 flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden ${isFilterOpen ? 'block' : 'hidden'}`} onClick={() => setIsFilterOpen(false)}></div>
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:w-64 md:translate-x-0 md:bg-transparent md:h-auto`}>
                <ShopSidebar
                    allColors={allColors}
                    allSizes={allSizes}
                    filters={filters}
                    setFilters={setFilters}
                    sort={sort}
                    setSort={setSort}
                    onClose={() => setIsFilterOpen(false)} // Pass close function
                />
            </div>
            
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1
                        onClick={() => router.push("/shop")}
                        className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"
                    >
                        {search && <MoveLeftIcon size={20} />} All{" "}
                        <span className="text-slate-700 font-medium">Products</span>
                    </h1>
                    {/* Mobile Filter Button */}
                    <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-md">
                        <FilterIcon size={16} />
                        <span>Filters</span>
                    </button>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto mb-32">
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
