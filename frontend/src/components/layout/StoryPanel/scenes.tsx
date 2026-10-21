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
    image: "/images/desert.png",
    eyebrow: "EVERY JOURNEY BEGINS WITH POSSIBILITY",
    title: (
      <>
        Where there is possibility,<br />
        <em>hope takes root.</em>
      </>
    ),
    text: "Even the quietest landscape holds the promise of a new beginning.",
    label: "The possibility",
  },
  {
    image: "/images/hospital-v2.png",
    eyebrow: "KNOWLEDGE THAT MAKES A DIFFERENCE",
    title: (
      <>
        A place to learn.<br />
        <em>A future to heal.</em>
      </>
    ),
    text: "Grow your knowledge. Inspire better care. Become part of something meaningful.",
    label: "A brighter tomorrow",
  },
];
