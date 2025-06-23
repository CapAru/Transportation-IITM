
export async function generateMetadata() {
    return {
        title: "Sign Up",
        description: "Create a new account",
    };
}

export default function RootLayout({ children }){
    return (
        <div>
            {children}
        </div>
    )
}