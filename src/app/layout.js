import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="montserrat">
        {children}
      </body>
    </html>
  );
}
