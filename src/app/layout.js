"use client";
import PageFooter from "@/components/PageFooter";
import "./globals.css";
export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full">
            <body className="fira-sans h-full flex flex-col">
                <main className="flex-1">{children}</main>
                <PageFooter />
            </body>
        </html>
    );
}
