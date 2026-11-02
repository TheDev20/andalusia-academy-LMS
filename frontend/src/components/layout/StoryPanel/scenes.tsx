import type { ReactNode } from "react";

export interface Scene {
  image: string;
  eyebrow: string;
  title: ReactNode;
  text: string;
  label: string;
}

export const defaultScenes: Scene[] = [
  {
    image: "/images/tech-hero.jpg",
    eyebrow: "EVERY JOURNEY BEGINS WITH ENGINEERING RIGOR",
    title: (
      <>
        Where code meets<br />
        <em>production scale.</em>
      </>
    ),
    text: "Master distributed architectures, modern full-stack systems, and cloud-native engineering with senior mentors.",
    label: "Systems mastery",
  },
  {
    image: "/images/tech-lab.jpg",
    eyebrow: "APPLIED AI & DATA SCIENCE STUDIOS",
    title: (
      <>
        A place to build.<br />
        <em>A future to engineer.</em>
      </>
    ),
    text: "Ship real-world capstones, train autonomous AI agents, and accelerate your software engineering career.",
    label: "Production labs",
  },
];
