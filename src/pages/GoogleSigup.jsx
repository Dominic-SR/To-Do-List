import React, { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/context/AuthContext';

const GoogleSignup = () => {
  const { user, login, logout, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  };

  // Google OAuth Login Trigger
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        login(profile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => console.error('Sign-In Error:', error),
  });

  const handleLogout = () => {
    googleLogout();
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        
        {user ? (
          /* ================= SIGNED-IN VIEW ================= */
          <div className="text-center space-y-6">
            <span className="inline-block px-3.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold">
              Authenticated with Google
            </span>

            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full border-2 border-indigo-500/30 shadow-md mb-4"
              />
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDashboardClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
              >
                Go to Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-all border border-slate-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ================= GOOGLE-ONLY SIGNUP VIEW ================= */
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Get Started
              </h1>
              <p className="text-sm text-slate-500">
                Sign up in one click using your Google Account
              </p>
            </div>

            {/* Google Authentication Button */}
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleGoogleSignIn()}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-xl border border-slate-300 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="text-sm font-medium text-slate-500">Connecting...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Privacy note */}
            <p className="pt-2 border-t border-slate-100 text-center text-xs text-slate-400">
              No password required • Secure OAuth 2.0 connection
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default GoogleSignup;