import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const isApiRoute = pathname.startsWith("/api/");
    const isPublicApi = [
        "/api/login",
        "/api/register",
        "/api/remove-expired-user",
    ].some((p) => pathname.startsWith(p));

    const isProtectedPage = pathname.startsWith("/admin");

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken");

    if (!sessionToken) {
        // If accessing protected frontend page or protected API without token
        if (!isApiRoute || !isPublicApi) {
            return redirectToLoginOrDeny(request, isApiRoute);
        }
        return NextResponse.next();
    }

    try {
        const accessToken = JSON.parse(sessionToken.value).accessToken;
        const secret = new TextEncoder().encode(
            process.env.ACCESS_TOKEN_SECRET
        );
        const { payload } = await jwtVerify(accessToken, secret);

        if ((!payload || !payload.userId || payload.exp < Date.now() / 1000) && isPublicApi) {
            // If token is invalid or expired
            cookieStore.delete("sessionToken");
            return NextResponse.next();
        }
        // 🛑 Admin route protection
        if (isProtectedPage && !payload.isAdmin) {
            return NextResponse.redirect(
                new URL("/access-denied", request.url)
            );
        }

        // Append headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.userId);
        requestHeaders.set("x-user-email", payload.email);
        requestHeaders.set(
            "x-user-admin",
            payload.isAdmin?.toString() || "false"
        );

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        sessionToken && cookieStore.delete("sessionToken");
        return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }
}

function redirectToLoginOrDeny(request, isApiRoute) {
    if (isApiRoute) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    } else {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/api/:path*", "/admin/:path*"],
};
