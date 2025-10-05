"use client";
import ProfileSidebar from "@/components/ProfileSideBar";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { LifeBuoy } from "lucide-react";

// Updated component with a button to open the form in a new tab
function SupportContent() {
    const { userProfile, loading: authLoading } = useAuth(); // Get the loading state from AuthContext
    const [formUrl, setFormUrl] = useState("");

    // --- CONFIGURATION ---
    // 1. Paste the direct SHARE link to your form here.
    const baseFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSffzopWqoOdVcCigmuj7UndPSwfTEFRXzG0WfU0nljuZMWF6Q/viewform"; 
    
    // 2. Replace these with the entry IDs from your form.
    const nameEntryId = "entry.1350686030";
    const emailEntryId = "entry.227234708";

    useEffect(() => {
        // Wait until the authentication check is complete before building the URL
        if (authLoading) {
            setFormUrl(""); // Keep URL empty while loading
            return;
        }
        
        const url = new URL(baseFormUrl);
        url.searchParams.set("usp", "pp_url"); // Important for pre-filling

        if (userProfile) {
            const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
            const email = userProfile.email || '';
            
            if (fullName) {
                url.searchParams.set(nameEntryId, fullName);
            }
            if (email) {
                url.searchParams.set(emailEntryId, email);
            }
        }
        
        setFormUrl(url.toString());

    }, [userProfile, authLoading]); // Effect now depends on the authentication loading state


    return (
        <div>
            <p className="text-slate-600 mb-6">
                If you have any questions or need help with your account, you can raise a support ticket. Our team is available 24/7 to assist you.
            </p>
             <div className="mt-8">
                <a
                    href={formUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Disable the link if the URL isn't ready or auth is still loading
                    className={`inline-flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors ${!formUrl && 'opacity-50 cursor-not-allowed'}`}
                >
                    <LifeBuoy size={20} />
                    Create Support Ticket
                </a>
            </div>
        </div>
    );
}

// Main page component remains the same
export default function SupportPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Support</h2>
                            <SupportContent />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}