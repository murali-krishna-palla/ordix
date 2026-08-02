import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";
import authService from "../../services/auth.service";
import { TOKEN_KEY } from "../../constants";

// Landing page for the Google OAuth redirect. Expects the backend to send
// the user back here with ?token=<jwt> once /auth/google/callback succeeds.
const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const finish = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        localStorage.setItem(TOKEN_KEY, token);
        const me = await authService.getMe();
        setSession(me, token);
        navigate("/dashboard", { replace: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        toast.error("Google sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <p className="text-sm text-muted">Signing you in…</p>
    </div>
  );
};

export default GoogleCallback;
