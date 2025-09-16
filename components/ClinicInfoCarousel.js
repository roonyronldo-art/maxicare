"use client";
import { useEffect, useState, useRef } from "react";

/**
 * Simple text carousel/slider. Receives an array of strings via `items` prop.
 * Auto-plays every 5 s but can be controlled manually via dots.
 */
export default function ClinicInfoCarousel({ items = [], interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [muted, setMuted] = useState(true);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const count = items.length;

  // auto-play
  useEffect(() => {
    if (!autoplay || count === 0) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, count, interval]);

  // When current slide is a video, pause autoplay until it ends
  useEffect(() => {
    const current = items[index];
    if (current && current.video) {
      // stop autoplay interval
      if (timerRef.current) clearInterval(timerRef.current);
      setAutoplay(false);
      // attach ended handler
      if (videoRef.current) {
        videoRef.current.onended = () => {
          setIndex((prev) => (prev + 1) % count);
          setAutoplay(true);
        };
      }
    } else {
      // if not video slide ensure autoplay resumes
      if (!autoplay) setAutoplay(true);
    }
    // cleanup on slide change
    return () => {
      if (videoRef.current) videoRef.current.onended = null;
    };
  }, [index, items, count]);


  const goTo = (i) => {
    setIndex(i);
    // stop autoplay on manual interaction
    if (autoplay) {
      setAutoplay(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  if (count === 0) return null;

  return (
    <div className="w-full flex justify-end -mr-4">
      <div className="w-full max-w-3xl text-center space-y-3 select-none bg-black/60 p-2 rounded-lg">
        {/* Slide wrapper with fixed height */}
        <div className="w-full aspect-video max-h-[600px] flex items-center justify-center overflow-hidden">
        {(() => {
          const current = items[index];
          if (typeof current === "string") {
            return (
              <p className="text-lg leading-relaxed h-full overflow-y-auto transition-opacity duration-500 text-[#ffd15c] font-extrabold whitespace-pre-line px-2">
                {`• ${current}`}
              </p>
            );
          }
          if (current && current.img) {
            return (
              <img
                src={current.img}
                alt={current.alt || "clinic"}
                className="w-full h-full object-contain rounded-md mx-auto"
              />
            );
          }
          if (current && current.video) {
            return (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={current.video}
                  muted={muted}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-md mx-auto"
                />
                <button
                  onClick={() => setMuted(!muted)}
                  className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  {muted ? '🔇' : '🔊'}
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                    } else {
                      videoRef.current.pause();
                    }
                  }}
                  className="absolute bottom-2 left-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  {videoRef.current && videoRef.current.paused ? '▶️' : '⏸️'}
                </button>
              </div>
            );
          }
          return null;
        })()}
        </div>


        {/* Dots */}
        <div className="flex justify-center gap-3">
          {items.map((item, i) => (
            <button
              key={i}
              aria-label={"Slide " + (i + 1)}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full border border-[#ffd15c] transition-colors duration-300 ${
                i === index ? "bg-[#ffd15c]" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
