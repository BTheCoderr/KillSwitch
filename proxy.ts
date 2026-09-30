import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/control", "/sim", "/api/admin"];

function unauthorized() {
  return new NextResponse("Producer authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Killswitch Producer", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  if (!PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const expectedUser = process.env.KILLSWITCH_ADMIN_USER;
  const expectedPassword = process.env.KILLSWITCH_ADMIN_PASSWORD;

  // Fail closed: producer surfaces should never become public because env vars were forgotten.
  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Producer access is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const splitAt = decoded.indexOf(":");
    if (splitAt === -1) return unauthorized();

    const user = decoded.slice(0, splitAt);
    const password = decoded.slice(splitAt + 1);

    if (user !== expectedUser || password !== expectedPassword) return unauthorized();
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/control/:path*",
    "/sim/:path*",
    "/api/admin/:path*",
  ],
};
