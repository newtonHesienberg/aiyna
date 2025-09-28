"use client";
import ProfileSidebar from "@/components/ProfileSideBar";
import { LifeBuoy, Mail } from "lucide-react";

// Component for the main content of the support page
function SupportContent() {
    return (
        <div>
            <p className="text-slate-600 mb-6">
                If you have any questions or need help with your account, you can contact us through the following channels. Our team is available 24/7 to assist you.
            </p>
            <div className="space-y-4">
                <div className="flex items-start p-4 border border-slate-200 rounded-lg">
                    <Mail size={24} className="text-slate-500 mr-4 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-slate-800">Email Support</h4>
                        <p className="text-sm text-slate-500">
                            Send us an email and we'll get back to you as soon as possible.
                        </p>
                        <a href="mailto:support@aina.com" className="text-sm text-indigo-600 hover:underline">
                            support@aina.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main page component that wraps the content with the sidebar and layout
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

