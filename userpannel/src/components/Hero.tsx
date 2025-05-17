import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    pauseBackgroundAudio?: () => void;
    playBackgroundAudio?: () => void;
  }
}

const Hero = () => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
        } else {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
          window.onYouTubeIframeAPIReady = () => resolve();
        }
      });
    };

    loadYouTubeAPI().then(() => {
      playerRef.current = new window.YT.Player("ytplayer", {
        events: {
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              window.pauseBackgroundAudio?.();
            } else if (
              state === window.YT.PlayerState.PAUSED ||
              state === window.YT.PlayerState.ENDED
            ) {
              window.playBackgroundAudio?.();
            }
          },
        },
      });
    });
  }, []);

  return (
    <div className="relative h-auto lg:h-[70vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://imgs.search.brave.com/bmVuGU65QMdjCV0m4hGxMwDMXx0aHnqm-i0ck1Ho2ns/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWFydGguY29tL2Fz/c2V0cy9fbmV4dC9p/bWFnZS8_dXJsPWh0/dHBzOi8vY2ZmMi5l/YXJ0aC5jb20vdXBs/b2Fkcy8yMDI1LzAz/LzI0MTYyODUxL2dh/bGF4eS1zcGlyYWwt/SjIzNDUzMjY4LTA0/NDkyNTZfdG9vLW1h/c3NpdmVfMW0tMTQw/MHg4NTAuanBnJnc9/MTIwMCZxPTc1')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-dark/70 to-temple-yellow/50"></div>
      </div>

      {/* Content + Video */}
      <div className="relative z-10 px-4 py-12 lg:py-0 temple-container h-full flex flex-col lg:flex-row items-center justify-between gap-10 text-white">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 drop-shadow-lg">
            Discover the Divine Bliss of Jalumuru Hill
          </h1>
          <p className="text-lg md:text-xl mb-4 max-w-prose">
            Sri Vara Siddhi Vinayaka Kshethram
          </p>
          <p className="text-lg md:text-xl mb-4 max-w-prose">
            Experience spiritual tranquility and cultural heritage at one of
            India's most sacred temple sites.
          </p>
          <p className="text-base mb-6">
            <b>NOTE:</b> This website is under Development Stage. For any
            Temple Donation, <br />
            Contact:{" "}
            <a
              href="https://jalamuru.blogspot.com/2025/05/blog-post.html"
              className="underline"
            >
              <b>+91 8374104423</b>
            </a>
          </p>
          <Link to="/temples">
            <Button className="bg-gold hover:bg-gold-dark text-foreground font-semibold px-6 py-6 text-lg rounded-md transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Temples
            </Button>
          </Link>
        </div>

        {/* Right Video Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl w-full aspect-video">
            <iframe
              id="ytplayer"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/l8pN_11Ilrc?enablejsapi=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
