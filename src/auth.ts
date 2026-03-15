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

        if (error || !user || !user.password_hash) {
          return null;
        }

        // Check if user is blocked
        if (user.is_blocked) {
          throw new Error('BLOCKED');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
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
