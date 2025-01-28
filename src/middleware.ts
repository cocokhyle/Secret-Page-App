import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to login if not authenticated
  },
});

export const config = {
  matcher: [
    "/secret-page-1/:path*",
    "/secret-page-2/:path*",
    "/secret-page-3/:path*",
  ],
};
