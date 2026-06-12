import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth session cookie or header
  const authSession = request.cookies.get("sdp_auth_session")?.value;

  // TEMP: Bypass auth check for easy testing — auto-set cookie if missing
  if (!authSession && pathname.startsWith("/dashboard")) {
    const response = NextResponse.next();
    // Set a mock session cookie so the app thinks user is logged in
    response.cookies.set("sdp_auth_session", JSON.stringify({
      user: {
        id: "user_auto_001",
        email: "madhavikodale567@gmail.com",
        name: "Madhavi",
        role: "admin",
        authMethod: "email",
      },
      status: "authenticated",
      accessToken: "mock_token",
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    }), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
