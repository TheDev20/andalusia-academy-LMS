import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Brand from "../../components/common/Brand";
import Field from "../../components/forms/Field";
import { authApi } from "../../services/api/authApi";
import "./AuthPage/AuthPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      setMessage(response.message);
      setDevToken(response.developmentResetToken ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start password recovery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-panel" aria-label="Forgot password">
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Brand href="/" />
          <Link to="/login" className="back-to-site-btn">
            <ArrowLeft size={13} aria-hidden="true" />
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
          Forgot your<br />
          <em>password?</em>
        </h1>
        <p className="intro">Enter your account e-mail and we'll send you a link to choose a new password.</p>

        {error && (
          <div role="alert" className="auth-notice auth-notice-error">
            {error}
          </div>
        )}

        {message ? (
          <div role="status" className="auth-notice auth-notice-success">
            <p style={{ margin: 0 }}>{message}</p>
            {devToken && (
              <p style={{ margin: "10px 0 0" }}>
                Development mode: e-mail delivery is not configured yet.{" "}
                <Link to={`/reset-password?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(devToken)}`}>
                  Continue to reset your password
                </Link>
                .
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field
              name="email"
              label="Account e-mail"
              placeholder="you@andalusiagroup.net"
              type="email"
              autoComplete="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              <span>{loading ? "Sending..." : "Send reset link"}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>

      <footer>
        <span>© {new Date().getFullYear()} Andalusia Academy</span>
      </footer>
    </section>
  );
}
