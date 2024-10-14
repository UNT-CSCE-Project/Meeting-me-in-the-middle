import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { db } from './app/lib/firebaseAdmin';
import type { User } from './app/lib/users/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | null> {
  try {
    const userSnapshot = await db.collection('users')
          .where('email', '==', email)
          .get();
      const users = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      if (users.length === 0) {
        return null; // No user found
      }

      
      return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials || {};

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
       
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = true; //await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return {
            id: user.id,
            name: user.name,
            email: user.email,  
          };
        }
        console.log('Invalid credentials');

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token + " asdaa "+ user.id);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log(token + " asdaaSESS "+ session.user.id);
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});