import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { tokenStore } from "../services/api/tokenStore";

function renderAt(path: string, allowedRoles?: string[]) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/admin" element={<p>Admin area</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

function signInAs(...roles: string[]) {
  tokenStore.save("token", { id: "u1", email: "u@x.test", firstName: "U", lastName: "X", fullName: "U X", roles, permissions: [] });
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("sends anonymous visitors to the login page", () => {
    renderAt("/admin", ["Admin"]);
    expect(screen.getByText("Login page")).toBeTruthy();
  });

  it("blocks signed-in users without an allowed role", () => {
    signInAs("Learner");
    renderAt("/admin", ["Admin"]);
    expect(screen.getByText("You don't have access to this page")).toBeTruthy();
    expect(screen.queryByText("Admin area")).toBeNull();
  });

  it("renders the page for an allowed role", () => {
    signInAs("Instructor", "Admin");
    renderAt("/admin", ["Admin"]);
    expect(screen.getByText("Admin area")).toBeTruthy();
  });

  it("allows any signed-in user when no roles are required", () => {
    signInAs("Learner");
    renderAt("/admin");
    expect(screen.getByText("Admin area")).toBeTruthy();
  });
});
