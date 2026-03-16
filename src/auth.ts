import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  // No adapter needed — we handle user lookup manually via credentials
  // JWT strategy means sessions are stored in cookies, not in DB

  session: {
    strategy: 'jwt',
    maxAge: 3600,
    updateAge: 0,
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Fetch user from PostgreSQL
        const { rows } = await db.query(
          'SELECT id, name, email, password_hash, role, image, is_blocked FROM users WHERE email = $1 LIMIT 1',
          [email.toLowerCase().trim()]
        );

        const user = rows[0];

        if (!user || !user.password_hash) {
          console.warn('[auth] User not found or has no password hash:', email);
          return null;
        }

        // Check if user is blocked
        if (user.is_blocked === true) {
          console.warn('[auth] Blocked user attempted login:', email);
          throw new Error('BLOCKED');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          console.warn('[auth] Invalid password for user:', email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
