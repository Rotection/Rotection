import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { robloxAuth, RobloxUser } from '@/services/robloxAuth';
import { toast } from './use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: {
    username?: string;
    roblox_user_id?: string;
    roblox_username?: string;
    provider?: string;
  } | null;
}

interface AuthActions {
  signInWithGoogle: () => Promise<void>;
  signInWithRoblox: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthState['profile']>) => Promise<void>;
  linkRobloxAccount: (code: string) => Promise<void>;
  unlinkRobloxAccount: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null,
  });

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, roblox_user_id, roblox_username, provider')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setState(prev => ({ ...prev, loading: false }));
          }
          return;
        }

        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            session,
            loading: false,
            profile,
          });
        } else if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
            profile: null,
          });
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.id);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            session,
            loading: false,
            profile,
          });
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            profile: null,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Sign-in Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Sign in with Roblox
  const signInWithRoblox = useCallback(async () => {
    try {
      const state = crypto.randomUUID();
      localStorage.setItem('roblox_oauth_state', state);

      const authUrl = robloxAuth.getAuthorizationUrl(state);
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Roblox sign-in error:', error);
      toast({
        title: 'Sign-in Error',
        description: error.message || 'Failed to initiate Roblox sign-in',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any stored tokens
      localStorage.removeItem('roblox_access_token');
      localStorage.removeItem('roblox_refresh_token');
      localStorage.removeItem('roblox_oauth_state');

      setState({
        user: null,
        session: null,
        loading: false,
        profile: null,
      });
    } catch (error: any) {
      console.error('Sign-out error:', error);
      toast({
        title: 'Sign-out Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<AuthState['profile']>) => {
    if (!state.user) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: state.user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));

      return data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Profile Update Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.user]);

  // Link Roblox account to existing account
  const linkRobloxAccount = useCallback(async (code: string) => {
    if (!state.user) {
      throw new Error('No authenticated user');
    }

    try {
      // Exchange code for token
      const tokenData = await robloxAuth.exchangeCodeForToken(code);

      // Get user info
      const robloxUser: RobloxUser = await robloxAuth.getUserInfo(tokenData.access_token);

      // Store tokens securely (you might want to encrypt these)
      localStorage.setItem('roblox_access_token', tokenData.access_token);
      localStorage.setItem('roblox_refresh_token', tokenData.refresh_token);

      // Update profile with Roblox info
      await updateProfile({
        roblox_user_id: robloxUser.id.toString(),
        roblox_username: robloxUser.name,
      });

      toast({
        title: 'Account Linked',
        description: `Successfully linked Roblox account: ${robloxUser.name}`,
      });
    } catch (error: any) {
      console.error('Roblox account linking error:', error);
      toast({
        title: 'Account Linking Error',
        description: error.message || 'Failed to link Roblox account',
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.user, updateProfile]);

  // Unlink Roblox account
  const unlinkRobloxAccount = useCallback(async () => {
    if (!state.user) {
      throw new Error('No authenticated user');
    }

    try {
      // Revoke tokens if available
      const accessToken = localStorage.getItem('roblox_access_token');
      if (accessToken) {
        try {
          await robloxAuth.revokeToken(accessToken);
        } catch (error) {
          console.warn('Failed to revoke Roblox token:', error);
        }
      }

      // Clear stored tokens
      localStorage.removeItem('roblox_access_token');
      localStorage.removeItem('roblox_refresh_token');

      // Update profile to remove Roblox info
      await updateProfile({
        roblox_user_id: null,
        roblox_username: null,
      });

      toast({
        title: 'Account Unlinked',
        description: 'Successfully unlinked Roblox account',
      });
    } catch (error: any) {
      console.error('Roblox account unlinking error:', error);
      toast({
        title: 'Account Unlinking Error',
        description: error.message || 'Failed to unlink Roblox account',
        variant: 'destructive',
      });
      throw error;
    }
  }, [state.user, updateProfile]);

  return {
    ...state,
    signInWithGoogle,
    signInWithRoblox,
    signOut,
    updateProfile,
    linkRobloxAccount,
    unlinkRobloxAccount,
  };
};

export type { AuthState, AuthActions };
