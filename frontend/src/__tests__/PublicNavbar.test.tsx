import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PublicNavbar from "../components/layout/PublicNavbar/PublicNavbar";
import { tokenStore } from "../services/api/tokenStore";

function signInAs(...roles: string[]) {
  tokenStore.save("token", { id: "u1", email: "u@x.test", firstName: "U", lastName: "X", fullName: "U X", roles, permissions: [] });
}

function renderNavbar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/instructor"]}>
        <PublicNavbar currentPath={"instructor" as never} onNavigate={() => {}} />
      </MemoryRouter>
    </AuthProvider>,
  );
}

const catalogLinks = () => screen.queryAllByRole("link", { name: /(course|browse) catalog/i });

describe("PublicNavbar workspace tabs", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("shows instructors their cohorts and account settings but no course catalog", () => {
    signInAs("Instructor");
    renderNavbar();

    expect(screen.getAllByRole("link", { name: /my cohorts/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /account settings/i }).length).toBeGreaterThan(0);
    expect(catalogLinks()).toHaveLength(0);
  });

  it.each([["Learner"], ["Admin"], ["ContentManager"]])("still shows the catalog to a %s", (role) => {
    signInAs(role);
    renderNavbar();

    expect(catalogLinks().length).toBeGreaterThan(0);
  });
});
