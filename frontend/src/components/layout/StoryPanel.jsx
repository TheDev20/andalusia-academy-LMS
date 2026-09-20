import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

export const defaultScenes = [
  {
    image: '/images/desert.png',
    eyebrow: 'EVERY JOURNEY BEGINS WITH POSSIBILITY',
    title: (
      <>
        Where there is possibility,<br />
        <em>hope takes root.</em>
      </>
    ),
    text: 'Even the quietest landscape holds the promise of a new beginning.',
    label: 'The possibility'
  },
  {
    image: '/images/hospital-v2.png',
    eyebrow: 'KNOWLEDGE THAT MAKES A DIFFERENCE',
    title: (
      <>
        A place to learn.<br />
        <em>A future to heal.</em>
      </>
    ),
    text: 'Grow your knowledge. Inspire better care. Become part of something meaningful.',
    label: 'A brighter tomorrow'
  }
];

export default function StoryPanel({ scenes = defaultScenes, motion, setMotion }) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setScene(1), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="story-panel" aria-label="A journey from possibility to healing">
      {scenes.map((item, i) => (
        <div
          key={item.image}
          className={`scene ${scene === i ? 'selected' : ''}`}
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
        <p className="story-eyebrow">{scenes[scene].eyebrow}</p>
        <h2>{scenes[scene].title}</h2>
        <p className="story-description">{scenes[scene].text}</p>
      </div>
      <div className="story-bottom">
        <div className="scene-index">
          <span>0{scene + 1}</span>
          <span className="track">
            <i style={{ transform: `translateX(${scene * 100}%)` }} />
          </span>
          <span className="total">02</span>
          <span className="scene-name">{scenes[scene].label}</span>
        </div>
        <div className="scene-controls">
          <button
            onClick={() => setMotion(!motion)}
            aria-label={motion ? 'Pause background motion' : 'Play background motion'}
          >
            {motion ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setScene((scene + 1) % 2)}
            aria-label="Previous scene"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => setScene((scene + 1) % 2)}
            aria-label="Next scene"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
