import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import connectionDatabase from '@/lib/mongoose'



const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Invalid credentials')
        }
        

        await connectionDatabase()
        
        const user = await User.findOne({ name: credentials.username })
        
        if (!user) {
          throw new Error('No user found')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user._id.toString(),
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.name = token.name
      }
      return session
    }
  },
  pages: {
    signIn: '/signin',
  },
  session: { strategy: "jwt" }
})

export { handler as GET, handler as POST }
