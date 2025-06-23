export async function generateMetadata() {
    return {
        title: "Login",
        description: "Login to your account",
    };
}

export default function RootLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}
