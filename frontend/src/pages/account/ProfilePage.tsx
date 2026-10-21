import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/api/authApi";
import { useAuth } from "../../context/AuthContext";
import type { UpdateProfileRequest } from "../../types/auth";
import { ErrorAlert, Field, LoadingState, PortalPage, SuccessAlert } from "../../components/portal/Portal";
import { formatDate } from "../../utils/format";

const EMPTY_FORM: UpdateProfileRequest = { firstName: "", lastName: "", phoneNumber: "", countryCode: "EG", preferredLanguage: "ar" };

export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: ({ signal }) => authApi.getProfile(signal) });

  const [form, setForm] = useState<UpdateProfileRequest>(EMPTY_FORM);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const p = profileQuery.data;
    if (p) {
      setForm({
        firstName: p.firstName,
        lastName: p.lastName,
        phoneNumber: p.phoneNumber ?? "",
        countryCode: p.countryCode,
        preferredLanguage: p.preferredLanguage,
      });
    }
  }, [profileQuery.data]);

  const updateProfile = useMutation({
    mutationFn: (request: UpdateProfileRequest) =>
      authApi.updateProfile({ ...request, phoneNumber: request.phoneNumber?.trim() || null }),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      if (user && token) {
        login(token, { ...user, firstName: profile.firstName, lastName: profile.lastName, fullName: `${profile.firstName} ${profile.lastName}` });
      }
      setSaved("Your profile has been updated.");
    },
  });

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState<string | null>(null);

  const changePassword = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    onSuccess: (session) => {
      login(session.token, session.user);
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
      setPasswordSaved("Password changed. Other devices have been signed out.");
    },
  });

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(null);
    updateProfile.mutate(form);
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(null);
    setPasswordError(null);
    if (passwords.newPassword.length < 8) {
      setPasswordError("The new password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      setPasswordError("The new passwords do not match.");
      return;
    }
    changePassword.mutate();
  };

  const profile = profileQuery.data;

  return (
    <PortalPage
      eyebrow="My account"
      title="Profile"
      subtitle={profile ? `${profile.email} · member since ${formatDate(profile.createdAt)} · ${profile.roles.join(", ")}` : undefined}
    >
      <ErrorAlert error={profileQuery.error} />
      {profileQuery.isLoading ? (
        <LoadingState label="Loading your profile…" />
      ) : (
        <div className="portal-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" }}>
          <form className="portal-card portal-form" onSubmit={submitProfile} aria-label="Personal details">
            <h2 className="portal-card-title">Personal details</h2>
            <SuccessAlert message={saved} />
            <ErrorAlert error={updateProfile.error} />
            <div className="portal-form-grid">
              <Field label="First name">
                {(id) => <input id={id} className="portal-input" value={form.firstName} maxLength={100} required
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })} />}
              </Field>
              <Field label="Last name">
                {(id) => <input id={id} className="portal-input" value={form.lastName} maxLength={100} required
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })} />}
              </Field>
            </div>
            <Field label="Phone number">
              {(id) => <input id={id} className="portal-input" type="tel" value={form.phoneNumber ?? ""} maxLength={50}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />}
            </Field>
            <div className="portal-form-grid">
              <Field label="Country code (ISO)">
                {(id) => <input id={id} className="portal-input" value={form.countryCode} minLength={2} maxLength={2} required
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })} />}
              </Field>
              <Field label="Preferred language">
                {(id) => (
                  <select id={id} className="portal-select" value={form.preferredLanguage}
                    onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English</option>
                  </select>
                )}
              </Field>
            </div>
            <div>
              <button type="submit" className="portal-btn" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>

          <form className="portal-card portal-form" onSubmit={submitPassword} aria-label="Change password">
            <h2 className="portal-card-title">Change password</h2>
            <SuccessAlert message={passwordSaved} />
            <ErrorAlert error={passwordError ?? changePassword.error} />
            <Field label="Current password">
              {(id) => <input id={id} className="portal-input" type="password" autoComplete="current-password" required
                value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />}
            </Field>
            <Field label="New password">
              {(id) => <input id={id} className="portal-input" type="password" autoComplete="new-password" minLength={8} required
                value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />}
            </Field>
            <Field label="Confirm new password">
              {(id) => <input id={id} className="portal-input" type="password" autoComplete="new-password" required
                value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />}
            </Field>
            <div>
              <button type="submit" className="portal-btn" disabled={changePassword.isPending}>
                {changePassword.isPending ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PortalPage>
  );
}
