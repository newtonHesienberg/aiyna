'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Loading from '@/components/Loading';
import { useDispatch } from 'react-redux';
import { fetchCart, clearCart } from '@/lib/features/cart/cartSlice';
import { fetchWishlist, clearWishlist } from '@/lib/features/wishlist/wishlistSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // When user logs in, fetch their cart and wishlist
                dispatch(fetchCart());
                dispatch(fetchWishlist());
            } else {
                // When user logs out, clear their cart and wishlist from redux
                dispatch(clearCart());
                dispatch(clearWishlist());
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [dispatch]);

    const value = {
        currentUser,
        loading,
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};