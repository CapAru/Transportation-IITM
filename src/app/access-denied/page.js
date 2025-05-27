import Link from "next/link";
export default function AccessDeniedPage(error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center rounded-4xl border-red-800 border px-12 py-6 overflow-x-hidden">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-red-600">
                    {
                        "You are not logged in or your session has expired."}
                </p>
                <p className="text-gray-600 mt-2">
                    Please{" "}
                    <Link
                        href={`/login`}
                        className="font-bold hover:text-blue-800 transition hover:underline duration-300"
                    >
                        log in
                    </Link>{" "}
                    to get access
                </p>
            </div>
        </div>
    );
}