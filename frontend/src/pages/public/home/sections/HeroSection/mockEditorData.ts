export interface CodeToken {
  t: string;
  v: string;
}

export interface CodeLine {
  num: number;
  tokens: CodeToken[];
}

export interface TerminalLine {
  t: string;
  v: string;
}

export interface IdeFile {
  name: string;
  icon: string;
  iconColor: string;
  path: string;
  lang: string;
  lnCol: string;
  lines: CodeLine[];
  terminal: TerminalLine[];
}

// Authentic Multi-File IDE project tree matching reference layout
export const IDE_FILES: Record<string, IdeFile> = {
  "App.tsx": {
    name: "App.tsx",
    icon: "⚛",
    iconColor: "#38bdf8",
    path: "src > App.tsx",
    lang: "TypeScript JSX",
    lnCol: "Ln 18, Col 3",
    lines: [
      {
        num: 1,
        tokens: [
          { t: "kw", v: "import" },
          { t: "plain", v: " { " },
          { t: "fn", v: "useState" },
          { t: "plain", v: ", " },
          { t: "fn", v: "useEffect" },
          { t: "plain", v: " } " },
          { t: "kw", v: "from" },
          { t: "plain", v: " " },
          { t: "str", v: "'react'" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: "kw", v: "import" },
          { t: "plain", v: " " },
          { t: "str", v: "'./styles.css'" },
          { t: "plain", v: ";" },
        ],
      },
      { num: 3, tokens: [{ t: "plain", v: "" }] },
      {
        num: 4,
        tokens: [
          { t: "kw", v: "export" },
          { t: "plain", v: " " },
          { t: "kw", v: "default" },
          { t: "plain", v: " " },
          { t: "kw", v: "function" },
          { t: "plain", v: " " },
          { t: "fn", v: "App" },
          { t: "plain", v: "() {" },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "plain", v: "  " },
          { t: "kw", v: "const" },
          { t: "plain", v: " [" },
          { t: "var", v: "count" },
          { t: "plain", v: ", " },
          { t: "fn", v: "setCount" },
          { t: "plain", v: "] = " },
          { t: "fn", v: "useState" },
          { t: "plain", v: "(" },
          { t: "num", v: "0" },
          { t: "plain", v: ");" },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "plain", v: "  " },
          { t: "kw", v: "const" },
          { t: "plain", v: " [" },
          { t: "var", v: "track" },
          { t: "plain", v: "] = " },
          { t: "fn", v: "useState" },
          { t: "plain", v: "(" },
          { t: "str", v: "'AI & Full-Stack'" },
          { t: "plain", v: ");" },
        ],
      },
      { num: 7, tokens: [{ t: "plain", v: "" }] },
      {
        num: 8,
        tokens: [
          { t: "plain", v: "  " },
          { t: "kw", v: "return" },
          { t: "plain", v: " (" },
        ],
      },
      {
        num: 9,
        tokens: [
          { t: "plain", v: "    " },
          { t: "tag", v: "<" },
          { t: "fn", v: "div" },
          { t: "plain", v: " " },
          { t: "prop", v: "className" },
          { t: "op", v: "=" },
          { t: "str", v: '"andalusia-app"' },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 10,
        tokens: [
          { t: "plain", v: "      " },
          { t: "tag", v: "<" },
          { t: "fn", v: "header" },
          { t: "plain", v: " " },
          { t: "prop", v: "className" },
          { t: "op", v: "=" },
          { t: "str", v: '"header"' },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 11,
        tokens: [
          { t: "plain", v: "        " },
          { t: "tag", v: "<" },
          { t: "fn", v: "h1" },
          { t: "tag", v: ">" },
          { t: "plain", v: "Andalusia Production Lab" },
          { t: "tag", v: "</" },
          { t: "fn", v: "h1" },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 12,
        tokens: [
          { t: "plain", v: "        " },
          { t: "tag", v: "<" },
          { t: "fn", v: "p" },
          { t: "tag", v: ">" },
          { t: "plain", v: "Cohort 2026 · AI & Data Science" },
          { t: "tag", v: "</" },
          { t: "fn", v: "p" },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 13,
        tokens: [
          { t: "plain", v: "      " },
          { t: "tag", v: "</" },
          { t: "fn", v: "header" },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 14,
        tokens: [
          { t: "plain", v: "      " },
          { t: "tag", v: "<" },
          { t: "fn", v: "button" },
          { t: "plain", v: " " },
          { t: "prop", v: "onClick" },
          { t: "op", v: "=" },
          { t: "plain", v: "{() => " },
          { t: "fn", v: "setCount" },
          { t: "plain", v: "(c => c + 1)}" },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 15,
        tokens: [
          { t: "plain", v: "        Active Labs: {" },
          { t: "var", v: "count" },
          { t: "plain", v: "}" },
        ],
      },
      {
        num: 16,
        tokens: [
          { t: "plain", v: "      " },
          { t: "tag", v: "</" },
          { t: "fn", v: "button" },
          { t: "tag", v: ">" },
        ],
      },
      {
        num: 17,
        tokens: [
          { t: "plain", v: "    " },
          { t: "tag", v: "</" },
          { t: "fn", v: "div" },
          { t: "tag", v: ">" },
        ],
      },
      { num: 18, tokens: [{ t: "plain", v: "  );" }] },
      { num: 19, tokens: [{ t: "plain", v: "}" }] },
    ],
    terminal: [
      { t: "cmd", v: "➜ my-app npm run dev" },
      { t: "sub", v: "> my-app@0.0.0 dev" },
      { t: "sub", v: "> vite" },
      { t: "blank", v: "" },
      { t: "ok", v: "  VITE v5.0.8 ready in 317ms" },
      { t: "blank", v: "" },
      { t: "link", v: "  ➜ Local:   http://localhost:5173/" },
      { t: "dim", v: "  ➜ press h to show help" },
    ],
  },
  "styles.css": {
    name: "styles.css",
    icon: "#",
    iconColor: "#38bdf8",
    path: "src > styles.css",
    lang: "CSS",
    lnCol: "Ln 12, Col 1",
    lines: [
      {
        num: 1,
        tokens: [{ t: "comm", v: "/* Andalusia Academy Design Tokens */" }],
      },
      {
        num: 2,
        tokens: [
          { t: "kw", v: ":root" },
          { t: "plain", v: " {" },
        ],
      },
      {
        num: 3,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "--color-gold" },
          { t: "plain", v: ": " },
          { t: "str", v: "#d8a56f" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "--color-espresso" },
          { t: "plain", v: ": " },
          { t: "str", v: "#1c1612" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "--glass-bevel" },
          { t: "plain", v: ": " },
          { t: "str", v: "rgba(255, 255, 255, 0.45)" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "--backdrop" },
          { t: "plain", v: ": " },
          { t: "fn", v: "blur" },
          { t: "plain", v: "(" },
          { t: "num", v: "48px" },
          { t: "plain", v: ");" },
        ],
      },
      { num: 7, tokens: [{ t: "plain", v: "}" }] },
      { num: 8, tokens: [{ t: "plain", v: "" }] },
      {
        num: 9,
        tokens: [
          { t: "kw", v: ".andalusia-app" },
          { t: "plain", v: " {" },
        ],
      },
      {
        num: 10,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "display" },
          { t: "plain", v: ": " },
          { t: "str", v: "flex" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 11,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "flex-direction" },
          { t: "plain", v: ": " },
          { t: "str", v: "column" },
          { t: "plain", v: ";" },
        ],
      },
      { num: 12, tokens: [{ t: "plain", v: "}" }] },
    ],
    terminal: [
      { t: "cmd", v: "➜ my-app npm run build:css" },
      { t: "ok", v: "  ✓ PostCSS compiled in 14ms" },
      { t: "dim", v: "  ➜ 0 errors · 0 warnings" },
    ],
  },
  "train_agent.py": {
    name: "train_agent.py",
    icon: "🐍",
    iconColor: "#facc15",
    path: "src > train_agent.py",
    lang: "Python 3.12",
    lnCol: "Ln 11, Col 4",
    lines: [
      {
        num: 1,
        tokens: [
          { t: "kw", v: "import" },
          { t: "plain", v: " " },
          { t: "var", v: "torch" },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: "kw", v: "from" },
          { t: "plain", v: " " },
          { t: "var", v: "transformers" },
          { t: "plain", v: " " },
          { t: "kw", v: "import" },
          { t: "plain", v: " " },
          { t: "type", v: "AutoModelForCausalLM" },
          { t: "plain", v: ", " },
          { t: "type", v: "Trainer" },
        ],
      },
      { num: 3, tokens: [{ t: "plain", v: "" }] },
      {
        num: 4,
        tokens: [
          { t: "comm", v: "# Initialize Andalusia Fine-Tuned LLM Pipeline" },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "var", v: "model" },
          { t: "op", v: " = " },
          { t: "type", v: "AutoModelForCausalLM" },
          { t: "op", v: "." },
          { t: "fn", v: "from_pretrained" },
          { t: "plain", v: "(" },
          { t: "str", v: '"andalusia-7b"' },
          { t: "plain", v: ")" },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "var", v: "optimizer" },
          { t: "op", v: " = " },
          { t: "var", v: "torch" },
          { t: "op", v: "." },
          { t: "var", v: "optim" },
          { t: "op", v: "." },
          { t: "type", v: "AdamW" },
          { t: "plain", v: "(" },
          { t: "var", v: "model" },
          { t: "op", v: "." },
          { t: "fn", v: "parameters" },
          { t: "plain", v: "(), " },
          { t: "prop", v: "lr" },
          { t: "op", v: "=" },
          { t: "num", v: "2e-5" },
          { t: "plain", v: ")" },
        ],
      },
      { num: 7, tokens: [{ t: "plain", v: "" }] },
      {
        num: 8,
        tokens: [
          { t: "kw", v: "def" },
          { t: "plain", v: " " },
          { t: "fn", v: "evaluate_agent" },
          { t: "plain", v: "(" },
          { t: "prop", v: "eval_dataset" },
          { t: "plain", v: "):" },
        ],
      },
      {
        num: 9,
        tokens: [
          { t: "plain", v: "    " },
          { t: "var", v: "metrics" },
          { t: "op", v: " = " },
          { t: "var", v: "trainer" },
          { t: "op", v: "." },
          { t: "fn", v: "evaluate" },
          { t: "plain", v: "(" },
          { t: "prop", v: "eval_dataset" },
          { t: "plain", v: ")" },
        ],
      },
      {
        num: 10,
        tokens: [
          { t: "plain", v: "    " },
          { t: "kw", v: "return" },
          { t: "plain", v: " {" },
          { t: "str", v: '"accuracy"' },
          { t: "op", v: ": " },
          { t: "num", v: "0.994" },
          { t: "plain", v: ", " },
          { t: "str", v: '"loss"' },
          { t: "op", v: ": " },
          { t: "num", v: "0.042" },
          { t: "plain", v: "}" },
        ],
      },
    ],
    terminal: [
      { t: "cmd", v: "➜ my-app python train_agent.py --eval" },
      { t: "sub", v: "> Detected 8x NVIDIA H100 GPU Cluster" },
      { t: "sub", v: "> Model Checkpoint: andalusia-7b-v2" },
      { t: "blank", v: "" },
      { t: "ok", v: "  ✓ Validation Complete: 99.4% Accuracy · Loss: 0.042" },
      {
        t: "link",
        v: "  ➜ Latency: 14ms · Zero Hallucination Guardrails Active",
      },
    ],
  },
  "package.json": {
    name: "package.json",
    icon: "{ }",
    iconColor: "#f97316",
    path: "package.json",
    lang: "JSON",
    lnCol: "Ln 10, Col 2",
    lines: [
      { num: 1, tokens: [{ t: "plain", v: "{" }] },
      {
        num: 2,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: '"name"' },
          { t: "plain", v: ": " },
          { t: "str", v: '"andalusia-lms"' },
          { t: "plain", v: "," },
        ],
      },
      {
        num: 3,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: '"version"' },
          { t: "plain", v: ": " },
          { t: "str", v: '"2.0.0"' },
          { t: "plain", v: "," },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: '"dependencies"' },
          { t: "plain", v: ": {" },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "plain", v: "    " },
          { t: "prop", v: '"react"' },
          { t: "plain", v: ": " },
          { t: "str", v: '"^19.1.0"' },
          { t: "plain", v: "," },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "plain", v: "    " },
          { t: "prop", v: '"@andalusia/core"' },
          { t: "plain", v: ": " },
          { t: "str", v: '"^2.4.0"' },
          { t: "plain", v: "," },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "plain", v: "    " },
          { t: "prop", v: '"torch"' },
          { t: "plain", v: ": " },
          { t: "str", v: '"^2.3.0"' },
        ],
      },
      { num: 8, tokens: [{ t: "plain", v: "  }" }] },
      { num: 9, tokens: [{ t: "plain", v: "}" }] },
    ],
    terminal: [
      { t: "cmd", v: "➜ my-app npm audit" },
      { t: "ok", v: "  ✓ found 0 vulnerabilities" },
    ],
  },
  "vite.config.ts": {
    name: "vite.config.ts",
    icon: "⚡",
    iconColor: "#a855f7",
    path: "vite.config.ts",
    lang: "TypeScript",
    lnCol: "Ln 6, Col 1",
    lines: [
      {
        num: 1,
        tokens: [
          { t: "kw", v: "import" },
          { t: "plain", v: " { " },
          { t: "fn", v: "defineConfig" },
          { t: "plain", v: " } " },
          { t: "kw", v: "from" },
          { t: "plain", v: " " },
          { t: "str", v: "'vite'" },
          { t: "plain", v: ";" },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: "kw", v: "import" },
          { t: "plain", v: " " },
          { t: "var", v: "react" },
          { t: "plain", v: " " },
          { t: "kw", v: "from" },
          { t: "plain", v: " " },
          { t: "str", v: "'@vitejs/plugin-react'" },
          { t: "plain", v: ";" },
        ],
      },
      { num: 3, tokens: [{ t: "plain", v: "" }] },
      {
        num: 4,
        tokens: [
          { t: "kw", v: "export" },
          { t: "plain", v: " " },
          { t: "kw", v: "default" },
          { t: "plain", v: " " },
          { t: "fn", v: "defineConfig" },
          { t: "plain", v: "({" },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "plain", v: "  " },
          { t: "prop", v: "plugins" },
          { t: "plain", v: ": [" },
          { t: "fn", v: "react" },
          { t: "plain", v: "()]," },
        ],
      },
      { num: 6, tokens: [{ t: "plain", v: "});" }] },
    ],
    terminal: [
      { t: "cmd", v: "➜ my-app vite --version" },
      { t: "ok", v: "  vite/5.0.8 win32-x64" },
    ],
  },
};
