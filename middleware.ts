import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;

    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', currentPath);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout/:path*',       // تمام صفحات زیرمجموعه checkout
        // '/dashboard/:path*',    // مسیرهای بیشتری اگر داشتی اینجا اضافه کن
    ],
};
