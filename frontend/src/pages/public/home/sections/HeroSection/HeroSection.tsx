import { useState } from "react";
import {
  ArrowRight,
  Search,
  Play,
  Code2,
  Files,
  GitBranch,
  Bug,
  Blocks,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  X,
  Plus,
  Trash2,
  Bell,
  ArrowLeft,
  Maximize2,
  Minus,
} from "lucide-react";
import { NavigateFunction, ROUTES } from "../../../../../types/navigation";
import { useCountdown } from "../../../../../hooks/useCountdown";
import HeroSearch from "./HeroSearch";
import "./HeroSection.css";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";

import {
  IDE_FILES,
  CodeToken,
  CodeLine,
  TerminalLine,
  IdeFile,
} from "./mockEditorData";
export type { CodeToken, CodeLine, TerminalLine, IdeFile };

export interface HeroSectionProps {
  onNavigate?: NavigateFunction;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [activeFile, setActiveFile] = useState("App.tsx");

  const timeLeft = useCountdown({
    days: 12,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  const goToCatalog = () => onNavigate?.(ROUTES.COURSES);

  const currentFile = IDE_FILES[activeFile] || IDE_FILES["App.tsx"];

  return (
    <section
      id="home"
      className="hero-section scroll-section"
      aria-label="Hero"
    >
      <Floating3DParticles color="#d8a56f" quantity={400} />
      <div className="hero-bg-accent" aria-hidden="true" />
      <div className="hero-container">
        {/* Left Column: Information & Conversion */}
        <div className="hero-content">
          {/* Live Cohort Countdown Pill */}
          <div className="hero-countdown-badge">
            <span className="live-pulsing-dot" aria-hidden="true" />
            <span className="countdown-label">ENROLLMENT CLOSES IN:</span>
            <div className="countdown-timer">
              <span className="time-val">{timeLeft.days}d</span>
              <span className="time-sep">:</span>
              <span className="time-val">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span className="time-sep">:</span>
              <span className="time-val">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span className="time-sep">:</span>
              <span className="time-val time-sec">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          {/* Hero Main Headline */}
          <h1 className="hero-title">
            Engineer the Future: Master{" "}
            <em>AI, Data Science & Full-Stack Systems.</em>
          </h1>
          <p className="hero-subtitle">
            Transform your technical expertise with hands-on labs, real-world
            codebases, and elite mentorship designed to position you for
            top-tier software roles.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <a
              href="/courses"
              className="btn-primary-hero"
              onClick={(e) => {
                e.preventDefault();
                goToCatalog();
              }}
            >
              <span>Explore All Programs</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            <a
              href="#cohort-schedule"
              className="btn-secondary-hero"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("cohort-schedule");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else goToCatalog();
              }}
            >
              <span>Upcoming Cohorts</span>
            </a>
          </div>

          {/* Unified Discovery Search Bar with live suggestions */}
          <HeroSearch />
        </div>

        {/* Right Column: Full Authentic VS Code Studio in Website Theme */}
        <div className="hero-visual">
          <div className="vscode-studio-window">
            {/* 1. Title Bar */}
            <div className="vscode-titlebar">
              <div className="titlebar-left">
                <div className="window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="titlebar-nav">
                  <ArrowLeft size={13} className="nav-arrow" />
                  <ArrowRight size={13} className="nav-arrow" />
                </div>
              </div>

              <div className="titlebar-center">
                <div className="command-palette-pill">
                  <Search size={12} className="cmd-icon" />
                  <span className="cmd-text">my-app</span>
                </div>
              </div>

              <div className="titlebar-right">
                <button
                  type="button"
                  className="btn-run-action"
                  title="Run Code"
                >
                  <Play size={11} fill="currentColor" />
                  <ChevronDown size={10} />
                </button>
                <div className="titlebar-win-controls">
                  <Minus size={11} />
                  <Maximize2 size={10} />
                  <X size={11} />
                </div>
              </div>
            </div>

            {/* 2. Main Studio Workspace (Activity Bar + Explorer + Editor/Terminal) */}
            <div className="vscode-main-workspace">
              {/* Activity Bar */}
              <div className="vscode-activity-bar">
                <div className="activity-top">
                  <div className="activity-item brand-badge">
                    <Code2 size={16} />
                  </div>
                  <button
                    type="button"
                    className="activity-item is-active"
                    title="Explorer"
                  >
                    <Files size={17} />
                  </button>
                  <button
                    type="button"
                    className="activity-item"
                    title="Search"
                  >
                    <Search size={17} />
                  </button>
                  <button
                    type="button"
                    className="activity-item"
                    title="Source Control"
                  >
                    <GitBranch size={17} />
                  </button>
                  <button
                    type="button"
                    className="activity-item"
                    title="Run and Debug"
                  >
                    <Bug size={17} />
                  </button>
                  <button
                    type="button"
                    className="activity-item"
                    title="Extensions"
                  >
                    <Blocks size={17} />
                  </button>
                </div>
                <div className="activity-bottom">
                  <button
                    type="button"
                    className="activity-item"
                    title="Accounts"
                  >
                    <User size={16} />
                  </button>
                  <button
                    type="button"
                    className="activity-item"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>

              {/* Sidebar Explorer */}
              <div className="vscode-sidebar">
                <div className="sidebar-header">
                  <span className="sidebar-title">EXPLORER</span>
                  <MoreHorizontal size={13} className="sidebar-opt-icon" />
                </div>

                <div className="sidebar-tree">
                  <div className="tree-project-root">
                    <ChevronDown size={11} />
                    <span className="root-name">MY-APP</span>
                  </div>

                  <div className="tree-items-list">
                    <div className="tree-row folder">
                      <ChevronRight size={10} />
                      <span>node_modules</span>
                    </div>
                    <div className="tree-row folder">
                      <ChevronRight size={10} />
                      <span>public</span>
                    </div>

                    <div className="tree-row folder is-open">
                      <ChevronDown size={10} />
                      <span>src</span>
                    </div>

                    <div className="tree-children">
                      <div className="tree-row folder sub-folder">
                        <ChevronRight size={10} />
                        <span>components</span>
                      </div>

                      {/* App.tsx */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === "App.tsx" ? "is-selected" : ""}`}
                        onClick={() => setActiveFile("App.tsx")}
                      >
                        <span className="file-glyph react">⚛</span>
                        <span className="file-name">App.tsx</span>
                      </button>

                      {/* styles.css */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === "styles.css" ? "is-selected" : ""}`}
                        onClick={() => setActiveFile("styles.css")}
                      >
                        <span className="file-glyph css">#</span>
                        <span className="file-name">styles.css</span>
                      </button>

                      {/* train_agent.py */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === "train_agent.py" ? "is-selected" : ""}`}
                        onClick={() => setActiveFile("train_agent.py")}
                      >
                        <span className="file-glyph python">🐍</span>
                        <span className="file-name">train_agent.py</span>
                      </button>
                    </div>

                    {/* Root Files */}
                    <button
                      type="button"
                      className={`tree-row file root-file ${activeFile === "package.json" ? "is-selected" : ""}`}
                      onClick={() => setActiveFile("package.json")}
                    >
                      <span className="file-glyph json">&#123; &#125;</span>
                      <span className="file-name">package.json</span>
                    </button>

                    <div className="tree-row file root-file">
                      <span className="file-glyph ts">TS</span>
                      <span className="file-name">tsconfig.json</span>
                    </div>

                    <button
                      type="button"
                      className={`tree-row file root-file ${activeFile === "vite.config.ts" ? "is-selected" : ""}`}
                      onClick={() => setActiveFile("vite.config.ts")}
                    >
                      <span className="file-glyph vite">⚡</span>
                      <span className="file-name">vite.config.ts</span>
                    </button>
                  </div>

                  <div className="sidebar-accordion">
                    <div className="accordion-row">
                      <ChevronRight size={10} />
                      <span>OUTLINE</span>
                    </div>
                    <div className="accordion-row">
                      <ChevronRight size={10} />
                      <span>TIMELINE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Code Editor & Integrated Terminal */}
              <div className="vscode-editor-panel">
                {/* Editor File Tabs */}
                <div className="editor-tabs-bar">
                  <div className="tabs-list">
                    <button
                      type="button"
                      className={`editor-tab ${activeFile === "App.tsx" ? "is-active" : ""}`}
                      onClick={() => setActiveFile("App.tsx")}
                    >
                      <span className="tab-glyph react">⚛</span>
                      <span className="tab-title">App.tsx</span>
                      <X size={11} className="tab-close" />
                    </button>

                    <button
                      type="button"
                      className={`editor-tab ${activeFile === "styles.css" ? "is-active" : ""}`}
                      onClick={() => setActiveFile("styles.css")}
                    >
                      <span className="tab-glyph css">#</span>
                      <span className="tab-title">styles.css</span>
                      <X size={11} className="tab-close" />
                    </button>

                    {activeFile === "train_agent.py" && (
                      <button type="button" className="editor-tab is-active">
                        <span className="tab-glyph python">🐍</span>
                        <span className="tab-title">train_agent.py</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}

                    {activeFile === "package.json" && (
                      <button type="button" className="editor-tab is-active">
                        <span className="tab-glyph json">&#123; &#125;</span>
                        <span className="tab-title">package.json</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}

                    {activeFile === "vite.config.ts" && (
                      <button type="button" className="editor-tab is-active">
                        <span className="tab-glyph vite">⚡</span>
                        <span className="tab-title">vite.config.ts</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Breadcrumbs Row */}
                <div className="editor-breadcrumbs">
                  <span className="crumb-path">{currentFile.path}</span>
                  <span className="crumb-sep">&gt;</span>
                  <span className="crumb-func">...</span>
                </div>

                {/* Code Lines Pane */}
                <div className="editor-code-body">
                  <pre className="code-pre">
                    <code>
                      {currentFile.lines.map((line: CodeLine, idx: number) => (
                        <div key={idx} className="code-line-row">
                          <span className="line-num" aria-hidden="true">{line.num}</span>
                          <span className="line-code">
                            {line.tokens.map((tok: CodeToken, tIdx: number) => (
                              <span key={tIdx} className={`tok-${tok.t}`}>
                                {tok.v}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Integrated Bottom Terminal Panel */}
                <div className="vscode-terminal-panel">
                  <div className="terminal-header">
                    <div className="terminal-tabs">
                      <span className="term-tab">PROBLEMS</span>
                      <span className="term-tab">OUTPUT</span>
                      <span className="term-tab">DEBUG CONSOLE</span>
                      <span className="term-tab is-active">TERMINAL</span>
                      <span className="term-tab">PORTS</span>
                    </div>

                    <div className="terminal-controls">
                      <Plus size={12} className="term-ctrl-icon" />
                      <div className="terminal-profile-select">
                        <span>zsh</span>
                        <ChevronDown size={10} />
                      </div>
                      <Trash2 size={12} className="term-ctrl-icon" />
                      <MoreHorizontal size={12} className="term-ctrl-icon" />
                      <X size={12} className="term-ctrl-icon" />
                    </div>
                  </div>

                  <div className="terminal-body">
                    {currentFile.terminal.map(
                      (item: TerminalLine, idx: number) => (
                        <div key={idx} className={`term-line term-${item.t}`}>
                          {item.v}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bottom Status Bar */}
            <div className="vscode-statusbar">
              <div className="statusbar-left">
                <div className="status-item git-item">
                  <GitBranch size={11} />
                  <span>main</span>
                </div>
                <div className="status-item status-issues">
                  <span>⊗ 0</span>
                  <span>⚠ 0</span>
                </div>
              </div>

              <div className="statusbar-right">
                <span className="status-item">{currentFile.lnCol}</span>
                <span className="status-item">Spaces: 2</span>
                <span className="status-item">UTF-8</span>
                <span className="status-item">LF</span>
                <span className="status-item lang-badge">
                  &#123; &#125; {currentFile.lang}
                </span>
                <span className="status-item">
                  <Bell size={11} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
