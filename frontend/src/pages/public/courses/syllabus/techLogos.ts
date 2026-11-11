/**
 * Brand logos for syllabus technologies (open-source SVGs from the svgl.app
 * library, found via 21st.dev's logo search). Matching is by normalised
 * name prefix so versioned entries such as "React 19" resolve to "react".
 * Technologies without an entry fall back to a generic icon in the UI.
 */
const LOGO_BASE = "/images/logos/tech";

const LOGO_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/^\.net/, "dotnet"],
  [/^c#/, "csharp"],
  [/^sql server/, "sql-server"],
  [/^postgresql/, "postgresql"],
  [/^redis/, "redis"],
  [/^docker/, "docker"],
  [/^kubernetes/, "kubernetes"],
  [/^apache kafka/, "apache-kafka"],
  [/^google cloud/, "google-cloud"],
  [/^python/, "python"],
  [/^fastapi/, "fastapi"],
  [/^terraform/, "terraform"],
  [/^grafana/, "grafana"],
  [/^aws/, "aws"],
  [/^github/, "github"],
  [/^hugging face/, "hugging-face"],
  [/^langchain/, "langchain"],
  [/^ollama/, "ollama"],
  [/^react/, "react"],
  [/^next\.js/, "nextjs"],
  [/^typescript/, "typescript"],
  [/^tailwind/, "tailwindcss"],
  [/^tanstack query/, "reactquery"],
  [/^trpc/, "trpc"],
  [/^prisma/, "prisma"],
  [/^vitest/, "vitest"],
  [/^playwright/, "playwright"],
];

export function getTechLogoUrl(name: string): string | null {
  const key = name.trim().toLowerCase();
  const match = LOGO_RULES.find(([pattern]) => pattern.test(key));
  return match ? `${LOGO_BASE}/${match[1]}.svg` : null;
}
