import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import {AuthProvider } from "@/app/context/AuthContext";
import { connectToPostgresDb } from "./config/config.js";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "AIna. - Shop smarter",
    description: "AIna. - Shop smarter",
};

export default async function RootLayout({ children }) {
    await connectToPostgresDb();
    return (
        <html lang="en">
        <body className={`${outfit.className} antialiased`}>
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