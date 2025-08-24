import { cookies } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/app/lib/validateAuth";

export const middleware = async (req: NextRequest) => {
  const cookieStore = await cookies();

  if (!cookieStore.get("refreshToken")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const authData = await validateAuth();
  if (!authData || !authData.success) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config: MiddlewareConfig = {
  matcher: "/profile",
};
