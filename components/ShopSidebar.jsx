'use client'
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { useSelector } from 'react-redux';

const ShopSidebar = ({ allColors, allSizes, filters, setFilters, sort, setSort }) => {

    const { list: categoryData } = useSelector((state) => state.category);

    // Handles adding/removing items from filter arrays (for multi-select)
    const handleMultiSelectChange = (type, value) => {
        setFilters(prev => {
            const currentValues = prev[type] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value) // Remove if already selected
                : [...currentValues, value]; // Add if not selected
            return { ...prev, [type]: newValues };
        });
    };

    const handlePriceChange = (e) => {
        setFilters(prev => ({ ...prev, price: parseInt(e.target.value, 10) }));
    };

    const clearFilters = () => {
        setFilters({
            price: 500,
            color: '',
            size: '',
            categories: [], // Changed to array
            subCategories: [], // Changed to array
        });
        setSort('newest');
    };

    return (
        <div className="w-full md:w-64 lg:w-72 pr-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Filters</h2>

            {/* Sort Dropdown */}
            <div className="mb-6">
                <label htmlFor="sort" className="block text-sm font-medium text-slate-600 mb-2">Sort by</label>
                <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            {/* --- NEW: Multi-Select Category Filters --- */}
            <div className="mb-6">
                {categoryData.map(cat => (
                    <div key={cat.id} className="mb-4">
                        <h3 className="text-sm font-medium text-slate-800 mb-2">{cat.name}</h3>
                        <div className="flex flex-col items-start gap-2 pl-2">
                            {cat.subCategories.map(sub => {
                                const isChecked = filters.subCategories.includes(sub.name);
                                return (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleMultiSelectChange('subCategories', sub.name)}
                                        className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600 transition"
                                    >
                                        {isChecked ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} className="text-slate-400" />}
                                        <span className={isChecked ? 'font-semibold text-indigo-600' : ''}>{sub.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Price Filter */}
            <div className="mb-6">
                <label htmlFor="price" className="block text-sm font-medium text-slate-600 mb-2">Price</label>
                <input type="range" id="price" min="0" max="500" value={filters.price} onChange={handlePriceChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                <div className="text-right text-sm text-slate-500 mt-1">Up to ${filters.price}</div>
            </div>

            {/* Color Filter (Single Select) */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-600 mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                        <button
                            key={color}
                            onClick={() => setFilters(prev => ({...prev, color: prev.color === color ? '' : color}))}
                            className={`size-8 rounded-full border-2 transition ${filters.color === color ? 'border-indigo-500 scale-110' : 'border-slate-200'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Size Filter (Single Select) */}
            <div className="mb-6">
                 <h3 className="text-sm font-medium text-slate-600 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setFilters(prev => ({...prev, size: prev.size === size ? '' : size}))}
                            className={`px-3 py-1 text-sm border rounded-md transition ${filters.size === size ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters Button */}
            <button onClick={clearFilters} className="w-full py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition">
                Clear All Filters
            </button>
        </div>
    );
};

export default ShopSidebar;