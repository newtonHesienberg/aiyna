'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
    });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSigningUp) {
        // Handle Sign Up
        const signupAndLoginPromise = async () => {
            // Step 1: Call the server API to create the user
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    firstName: formData.firstName?.trim(),
                    lastName: formData.lastName?.trim(),
                    mobile: formData.mobile?.trim(),
                }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to create account.');
            }

            // Step 2: If signup is successful, sign the user in
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
        };

        toast.promise(signupAndLoginPromise(), {
            loading: 'Creating your account...',
            success: () => {
                router.push('/');
                return 'Account created and logged in successfully!';
            },
            error: (error) => error.message,
        });

    } else {
        // Handle Login
        const loginPromise = signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.promise(loginPromise, {
            loading: 'Logging in...',
            success: () => {
                router.push('/');
                return 'Logged in successfully!';
            },
            error: (error) => error.message,
        });
    }
};

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const googleSignInPromise = async () => {
            // Step 1: Sign in with Google
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();
            const [firstName, ...lastNameParts] = user.displayName.split(' ');
            const lastName = lastNameParts.join(' ');

            // Step 2: Send user data to your backend to save it
            const response = await fetch('/api/auth/google-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    profileImage: user.photoURL,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user data.');
            }
        };

        toast.promise(googleSignInPromise(), {
            loading: 'Signing in with Google...',
            success: () => {
                router.push('/');
                return 'Logged in successfully!';
            },
            error: (err) => err.message || 'Failed to sign in with Google.',
        });
    };


    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    {isSigningUp ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSigningUp && (
                        <>
                            <div className="flex gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First Name</label>
                                    <input id="firstName" name="firstName" type="text" required onChange={handleChange} value={formData.firstName} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last Name</label>
                                    <input id="lastName" name="lastName" type="text" required onChange={handleChange} value={formData.lastName} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                                <input id="mobile" name="mobile" type="tel" required onChange={handleChange} value={formData.mobile} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required onChange={handleChange} value={formData.email} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required onChange={handleChange} value={formData.password} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isSigningUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Sign in with Google
                        </button>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600">
                    {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setIsSigningUp(!isSigningUp)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                        {isSigningUp ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}