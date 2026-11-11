import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole, Mail } from "lucide-react";
import Brand from "../../components/common/Brand";
import Field from "../../components/forms/Field";
import { authApi } from "../../services/api/authApi";
import "./AuthPage/AuthPage.css";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [token, setToken] = useState(params.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Your new password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email: email.trim(), token: token.trim(), newPassword: password });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-panel" aria-label="Reset password">
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Brand href="/" />
          <Link to="/login" className="back-to-site-btn">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to log in</span>
          </Link>
        </div>
        <span className="portal-label">LEARNING PORTAL</span>
      </header>

      <div className="form-content">
        <div className="section-label">
          <span /> ACCOUNT RECOVERY
        </div>
        <h1>
          Choose a new<br />
          <em>password.</em>
        </h1>
        <p className="intro">Reset links are single-use and expire after 30 minutes. All your other sessions will be signed out.</p>

        {error && (
          <div role="alert" className="auth-notice auth-notice-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Field name="email" label="Account e-mail" type="email" autoComplete="email" icon={Mail}
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field name="token" label="Reset code" autoComplete="one-time-code" icon={KeyRound}
            value={token} onChange={(e) => setToken(e.target.value)} required />
          <Field name="password" label="New password" type="password" autoComplete="new-password" icon={LockKeyhole}
            value={password} onChange={(e) => setPassword(e.target.value)} minLength={MIN_PASSWORD_LENGTH} required />
          <Field name="confirm" label="Confirm new password" type="password" autoComplete="new-password" icon={LockKeyhole}
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button type="submit" className="submit-btn" disabled={loading}>
            <span>{loading ? "Saving..." : "Reset password"}</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>

      <footer>
        <span>© {new Date().getFullYear()} Andalusia Academy</span>
      </footer>
    </section>
  );
}
