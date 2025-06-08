//Difference between redirect and rewrite(replace file with same url)


import { NextResponse } from 'next/server'  //NextResponse is a object 
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  
   if (request.nextUrl.pathname.startsWith('/contact')) {
    return NextResponse.rewrite(new URL('/contact-2', request.url))  //this renders contact-2 file but with url contact url
  }
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}