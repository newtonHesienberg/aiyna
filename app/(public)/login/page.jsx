'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false); // Toggle between Login and Sign Up
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const actionPromise = isSigningUp
            ? createUserWithEmailAndPassword(auth, email, password)
            : signInWithEmailAndPassword(auth, email, password);

        toast.promise(actionPromise, {
            loading: isSigningUp ? 'Creating account...' : 'Logging in...',
            success: () => {
                router.push('/');
                return isSigningUp ? 'Account created successfully!' : 'Logged in successfully!';
            },
            error: (error) => error.message,
        });
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success('Logged in with Google!');
            router.push('/');
        } catch (error) {
            toast.error('Failed to sign in with Google.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    {isSigningUp ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" T className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
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
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
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

