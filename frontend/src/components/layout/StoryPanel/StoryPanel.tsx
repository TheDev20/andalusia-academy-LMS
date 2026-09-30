import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { defaultScenes, type Scene } from "./scenes";
import "./StoryPanel.css";

export type { Scene };

export interface StoryPanelProps {
  scenes?: Scene[];
  motion?: boolean;
  setMotion?: (val: boolean) => void;
}

export default function StoryPanel({
  scenes = defaultScenes,
  motion = true,
  setMotion,
}: StoryPanelProps) {
  const [scene, setScene] = useState<number>(0);
  const totalScenes = scenes.length;

  useEffect(() => {
    if (totalScenes <= 1) return;
    const timer = window.setTimeout(() => setScene(1), 3000);
    return () => window.clearTimeout(timer);
  }, [totalScenes]);

  const handlePrev = () => {
    setScene((prev) => (prev - 1 + totalScenes) % totalScenes);
  };

  const handleNext = () => {
    setScene((prev) => (prev + 1) % totalScenes);
  };

  const currentScene = scenes[scene] || scenes[0];

  return (
    <section
      className="story-panel"
      aria-label="A journey from possibility to healing"
    >
      {scenes.map((item, i) => (
        <div
          key={item.image}
          className={`scene ${scene === i ? "selected" : ""}`}
          aria-hidden="true"
        >
          <img src={item.image} alt="" />
          <div className="image-shade" />
        </div>
      ))}
      <div className="story-top">
        <span className="story-tag">
          <span /> GROW WITH PURPOSE
        </span>
        <span className="edition">ANDALUSIA ACADEMY / 01</span>
      </div>
      <div className="story-copy" key={scene} aria-live="polite">
        <p className="story-eyebrow">{currentScene.eyebrow}</p>
        <h2>{currentScene.title}</h2>
        <p className="story-description">{currentScene.text}</p>
      </div>
      <div className="story-bottom">
        <div className="scene-index">
          <span>{String(scene + 1).padStart(2, "0")}</span>
          <span className="track">
            <i
              style={{
                width: `${100 / totalScenes}%`,
                transform: `translateX(${scene * 100}%)`,
              }}
            />
          </span>
          <span className="total">
            {String(totalScenes).padStart(2, "0")}
          </span>
          <span className="scene-name">{currentScene.label}</span>
        </div>
        <div className="scene-controls">
          <button
            onClick={() => setMotion && setMotion(!motion)}
            aria-label={
              motion ? "Pause background motion" : "Play background motion"
            }
          >
            {motion ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={handlePrev} aria-label="Previous scene">
            <ArrowLeft size={18} />
          </button>
          <button onClick={handleNext} aria-label="Next scene">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
