// Migration template. This intentionally mirrors the current Cognita AuthContext
// shape so routes can be converted incrementally behind VITE_BACKEND_PROVIDER.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { requireSupabase, supabaseConfigured } from "@/api/supabaseClient";

const AuthContext = createContext(null);

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadProfile = useCallback(async (userId) => {
    if (!userId || !supabaseConfigured) {
      setProfile(null);
      setRoles([]);
      return;
    }

    const supabase = requireSupabase();
    const [{ data: profileData, error: profileError }, { data: roleData, error: roleError }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase
          .from("staff_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("is_active", true)
          .is("revoked_at", null),
      ]);

    if (profileError) throw profileError;
    if (roleError) throw roleError;

    setProfile(profileData);
    setRoles((roleData || []).map((item) => item.role));
  }, []);

  const checkUserAuth = useCallback(async () => {
    if (!supabaseConfigured) {
      setSession(null);
      setProfile(null);
      setRoles([]);
      setIsLoadingAuth(false);
      setAuthError({
        type: "backend_not_configured",
        message: "Cognita account services are being configured.",
      });
      return null;
    }

    const supabase = requireSupabase();
    setIsLoadingAuth(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setIsLoadingAuth(false);
      setAuthError({ type: "auth_error", message: error.message });
      throw error;
    }

    setSession(data.session);
    await loadProfile(data.session?.user?.id);
    setIsLoadingAuth(false);
    return data.session;
  }, [loadProfile]);

  useEffect(() => {
    let unsubscribe = () => {};

    checkUserAuth().catch((error) => {
      console.error("Supabase auth initialization failed", error);
      setIsLoadingAuth(false);
    });

    if (supabaseConfigured) {
      const supabase = requireSupabase();
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        loadProfile(nextSession?.user?.id).catch((error) => {
          console.error("Profile refresh failed", error);
          setAuthError({ type: "profile_error", message: "Account profile could not be loaded." });
        });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }

    return unsubscribe;
  }, [checkUserAuth, loadProfile]);

  const signIn = useCallback(async ({ email, password }) => {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async ({ email, password, fullName }) => {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    const supabase = requireSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async (shouldRedirect = true) => {
    if (supabaseConfigured) {
      const { error } = await requireSupabase().auth.signOut();
      if (error) throw error;
    }

    setSession(null);
    setProfile(null);
    setRoles([]);
    if (shouldRedirect) window.location.assign("/");
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.assign("/signin");
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      session,
      profile,
      roles,
      isAuthenticated: Boolean(session?.user),
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: {
        public_site_available: true,
        backend_available: supabaseConfigured,
      },
      authChecked: !isLoadingAuth,
      backendAvailable: supabaseConfigured,
      hasRole: (role) => roles.includes(role),
      signIn,
      signUp,
      requestPasswordReset,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth,
    }),
    [
      session,
      profile,
      roles,
      isLoadingAuth,
      authError,
      signIn,
      signUp,
      requestPasswordReset,
      logout,
      navigateToLogin,
      checkUserAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  return context;
}
