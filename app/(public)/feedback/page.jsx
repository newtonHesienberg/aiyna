"use client";
import toast from "react-hot-toast";
import ProfileSidebar from "@/components/ProfileSideBar";

// Component for the main content of the feedback page
function FeedbackContent() {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Thank you for your feedback!");
        e.target.reset();
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className="text-slate-600 mb-6">We value your input! Please share any feedback or suggestions you have to help us improve.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="feedbackSubject">
                        Subject
                    </label>
                    <input type="text" id="feedbackSubject" className="w-full p-3 border border-slate-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="feedbackMessage">
                        Message
                    </label>
                    <textarea id="feedbackMessage" className="w-full p-3 border border-slate-300 rounded-md" rows="5" required></textarea>
                </div>
            </div>
            <div className="mt-6">
                <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-slate-700">
                    Submit Feedback
                </button>
            </div>
        </form>
    );
}

// Main page component that wraps the content with the sidebar and layout
export default function FeedbackPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <main className="w-full md:w-3/4">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Feedback & Suggestion</h2>
                            <FeedbackContent />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

