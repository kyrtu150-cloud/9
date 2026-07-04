import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Защита маршрутов на уровне edge (в дополнение к проверкам в layout):
 * - /app/*   — только авторизованные
 * - /admin/* — только роль admin
 * - POST к кастомным /api/* — проверка Origin (анти-CSRF, second line)
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Анти-CSRF: браузерные мутации должны приходить со своего origin.
  // NextAuth (/api/auth) имеет собственную CSRF-защиту — пропускаем.
  if (req.method !== "GET" && pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ ok: false, error: "Запрещено" }, { status: 403 });
    }
  }

  const needsAuth = pathname.startsWith("/app") || pathname.startsWith("/admin");
  if (!needsAuth) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const login = new URL("/auth/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/api/:path*"],
};
