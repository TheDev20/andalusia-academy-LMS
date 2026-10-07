import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StoryPanel from "../StoryPanel";

function AuthLayout() {
  const [motion, setMotion] = useState<boolean>(true);

  // Toggle locked viewport style for auth split screen
  useEffect(() => {
    document.documentElement.classList.add("auth-mode");
    document.body.classList.add("auth-mode");

    return () => {
      document.documentElement.classList.remove("auth-mode");
      document.body.classList.remove("auth-mode");
    };
  }, []);

  return (
    <main className={`shell ${motion ? "" : "motion-paused"}`}>
      <Outlet />
      <StoryPanel motion={motion} setMotion={setMotion} />
    </main>
  );
}
export default AuthLayout;
