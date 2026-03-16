import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  // Use JWT strategy so sessions work with credentials provider
  session: {
    strategy: 'jwt',
    // Max age 1 hour — inactivity handled client-side with signOut()
    maxAge: 3600,
    // Don't auto-extend session on every request (inactivity = no extension)
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

        // Fetch user from Supabase
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('id, name, email, password_hash, role, image, is_blocked')
          .eq('email', email.toLowerCase().trim())
          .single();

        if (error) {
          console.error('[auth] Database error during authorize:', error.message, error.details);
          return null;
        }

        if (!user || !user.password_hash) {
          console.warn('[auth] User not found or has no password hash:', email);
          return null;
        }

        // Check if user is blocked (resilient check)
        // If is_blocked is missing from DB, it will be undefined, treated as false
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
