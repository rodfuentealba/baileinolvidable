import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=TXlUkDvwVd8&list=RDTXlUkDvwVd8&start_radio=1";

const getYouTubeVideoId = (urlOrId: string) => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes("youtu.be")) return url.pathname.replace("/", "").slice(0, 11);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    return urlOrId;
  } catch { return urlOrId; }
};

const YOUTUBE_VIDEO_ID = getYouTubeVideoId(YOUTUBE_URL);

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false); // ← false por defecto
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const init = () => {
      playerRef.current = new (window as any).YT.Player("yt-player", {
        height: "0",
        width: "0",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0, // ← sin autoplay
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => {
            playerRef.current?.setVolume(30);
            setIsReady(true); // ← solo marca como listo
            console.log('YouTube player ready ✅');
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      init();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = init;
    }
  }, []);

  const togglePlay = () => {
    console.log('isReady:', isReady, 'player:', playerRef.current);
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      <div id="yt-player" className="hidden" />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-hero-navy/90 backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg border border-hero-navy-foreground/10">
        
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-counter-bg flex items-center justify-center hover:bg-counter-bg/80 transition-colors"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-hero-navy-foreground" />
          ) : (
            <Play className="w-4 h-4 text-hero-navy-foreground ml-0.5" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full flex items-center justify-center text-hero-navy-foreground/60 hover:text-hero-navy-foreground transition-colors"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {isPlaying && (
          <div className="flex items-end gap-[3px] h-4 ml-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-counter-bg rounded-full animate-equalizer"
                style={{ animationDelay: `${i * 0.15}s`, height: "60%" }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;