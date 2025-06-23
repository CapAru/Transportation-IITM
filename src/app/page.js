import Link from "next/link";

export const metadata = {
    title: "TDMS - Home",
    description: "Welcome to the Transport Data Management System",
};

export default function Home() {
    return (
        <>
            <div>Hello</div>
            <div className="flex flex-col items-center justify-center space-y-4">
                <Link
                    href="/login"
                    className="bg-blue-500 px-6 py-3 rounded-2xl text-amber-50"
                >
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="bg-blue-500 px-6 py-3 rounded-2xl text-amber-50"
                >
                    Register
                </Link>
                <Link
                    href="/admin"
                    className="bg-blue-500 px-6 py-3 rounded-2xl text-amber-50"
                >
                    Admin
                </Link>
                <Link
                    href="/access-denied"
                    className="bg-blue-500 px-6 py-3 rounded-2xl text-amber-50"
                >
                    Access Denied
                </Link>
            </div>
        </>
    );
}
