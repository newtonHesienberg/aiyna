import { Poppins } from "next/font/google"; // Using Poppins as a suggested funky font
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

// Define the new font (Poppins)
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
    title: "AIyna. - Designed for You by You",
    description: "AIyna. - Designed for You by You",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${poppins.className} antialiased`}> {/* Applied poppins class */}
        <StoreProvider>
            <AuthProvider>
                <Toaster />
                {children}
            </AuthProvider>
        </StoreProvider>
        </body>
        </html>
    );
}