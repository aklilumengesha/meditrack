import { NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const doctorRoutes = ["/doctor"];
const patientRoutes = ["/patient"];
const publicRoutes = ["/login", "/register", "/landing", "/change-password", "/forgot-password"];

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  if (isPublic) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  if (doctorRoutes.some((r) => pathname.startsWith(r)) && role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (patientRoutes.some((r) => pathname.startsWith(r)) && role !== "PATIENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (adminRoutes.some((r) => pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};
