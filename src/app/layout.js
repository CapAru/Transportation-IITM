"use client";
import "./globals.css";
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Welcome to the Transport Data Management System" />
                <title>TDMS - Home</title>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="fira-sans">{children}</body>
        </html>
    );
}
