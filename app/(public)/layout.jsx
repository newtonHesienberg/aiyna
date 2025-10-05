'use client'
import Banner from "../../components/Banner";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../lib/features/product/productSlice";
import { fetchCategories } from "../../lib/features/category/categorySlice";

export default function PublicLayout({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}