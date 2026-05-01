import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Logged in users can access
      if (token) return true
      return false
    }
  },
  pages: {
    signIn: '/login'
  }
})

export const config = {
  // Protect these paths
  matcher: [
    '/dashboard/:path*',
    '/api/compras/:path*',
    '/api/dashboard/:path*'
  ]
}