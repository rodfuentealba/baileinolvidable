import { useState, useEffect } from "react";
import palmerLeft from "@/assets/palmerLeft.png";

const LYRICS_PHASE_1 = [
  "Pensaba que contigo",
  "iba a envejecer...",
];

const LYRICS_PHASE_2 = [
  "En otra vida,",
  "en otro mundo",
  "podrá ser...",
];

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [fadeOut, setFadeOut] = useState(false);
  const [ready, setReady] = useState(false);

  const lyrics = phase === 1 ? LYRICS_PHASE_1 : LYRICS_PHASE_2;

  // Track page readiness
  useEffect(() => {
    const checkReady = () => {
      if (document.readyState === "complete") {
        setReady(true);
      }
    };
    checkReady();
    window.addEventListener("load", checkReady);
    return () => window.removeEventListener("load", checkReady);
  }, []);

  // Advance lines
  useEffect(() => {
    if (currentLine >= lyrics.length) {
      if (ready) {
        // Page loaded, fade out
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onFinished, 800);
        }, 600);
      } else if (phase === 1) {
        // Not ready yet, show phase 2
        setTimeout(() => {
          setPhase(2);
          setCurrentLine(0);
        }, 400);
      } else {
        // Phase 2 done but still loading, wait and exit
        const interval = setInterval(() => {
          if (document.readyState === "complete") {
            setFadeOut(true);
            setTimeout(onFinished, 800);
            clearInterval(interval);
          }
        }, 200);
        return () => clearInterval(interval);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentLine, phase, ready, lyrics.length, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-hero-navy flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Palm tree with gentle sway */}
      <img
        src={palmerLeft}
        alt="Palmera"
        className="w-20 md:w-28 mb-8 animate-loader-sway"
      />

      {/* Lyrics container */}
      <div className="text-center px-8 min-h-[120px] flex flex-col items-center justify-center">
        {lyrics.slice(0, currentLine).map((line, i) => (
          <p
            key={`${phase}-${i}`}
            className="font-display text-xl md:text-3xl text-hero-navy-foreground/90 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Subtle dots */}
      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-hero-navy-foreground/40 animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
