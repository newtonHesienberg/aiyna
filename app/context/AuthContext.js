'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Loading from '@/components/Loading';
import { useDispatch } from 'react-redux';
import { fetchCart, clearCart, addToCartAPI } from '@/lib/features/cart/cartSlice';
import { fetchWishlist, clearWishlist, toggleWishlistAPI } from '@/lib/features/wishlist/wishlistSlice';

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
                dispatch(fetchCart());
                dispatch(fetchWishlist());

                const pendingActionJSON = sessionStorage.getItem('pendingAction');
                if (pendingActionJSON) {
                    try {
                        const pendingAction = JSON.parse(pendingActionJSON);
                        if (pendingAction.type === 'TOGGLE_WISHLIST') {
                            dispatch(toggleWishlistAPI(pendingAction.payload));
                        }
                        if (pendingAction.type === 'ADD_TO_CART') {
                            dispatch(addToCartAPI(pendingAction.payload));
                        }
                        sessionStorage.removeItem('pendingAction');
                    } catch (error) {
                        console.error("Error processing pending action:", error);
                        sessionStorage.removeItem('pendingAction');
                    }
                }
            } else {
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