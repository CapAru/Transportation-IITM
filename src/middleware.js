import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/") && 
        !pathname.startsWith("/api/login") && 
        !pathname.startsWith("/api/register") &&
        !pathname.startsWith("/api/remove-expired-user")){
        
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("sessionToken");
        
        if (!sessionToken) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        try {
            const accessToken = JSON.parse(sessionToken.value).accessToken;
            
            // Convert secret to Uint8Array for jose
            const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
            
            // Verify token using jose
            const { payload } = await jwtVerify(accessToken, secret);
            
            // Add user info to request headers for API routes to access
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId);
            requestHeaders.set('x-user-email', payload.email);
            requestHeaders.set('x-user-admin', payload.isAdmin?.toString() || 'false');
            
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid token" }),
                {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};