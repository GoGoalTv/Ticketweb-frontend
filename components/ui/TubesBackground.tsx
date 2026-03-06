"use client";

import React, { useEffect, useRef, useState } from "react";

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

const randomColors = (count: number) => {
  return new Array(count).fill(0).map(
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0"),
  );
};

export function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tubesRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        // Load the effect dynamically
        // @ts-ignore
        // Fetch the UMD script and import it from a blob URL to avoid TS module-resolution errors
        const resp = await fetch(
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js",
        );
        const text = await resp.text();
        const blob = new Blob([text], { type: "text/javascript" });
        const blobUrl = URL.createObjectURL(blob);

        // Prevent bundlers from trying to process the blob URL at build time
        const module = (await import(/* webpackIgnore: true */ blobUrl)) as any;

        // cleanup
        URL.revokeObjectURL(blobUrl);

        // Determine export shape and initialize safely with debug logs
        const exported =
          module &&
          (module.default ?? module.TubesCursor ?? module.Tubes ?? module);
        console.debug("Tubes module exports:", exported);

        const options = {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
            },
          },
        };

        let app: any = null;

        try {
          // function factory: exported(canvas, opts)
          if (typeof exported === "function") {
            app = await exported(canvasRef.current, options);
          }

          // named init function: exported.init(canvas, opts)
          else if (exported && typeof exported.init === "function") {
            app = await exported.init(canvasRef.current, options);
          }

          // named constructor/factory on the object
          else if (exported && typeof exported.TubesCursor === "function") {
            app = await exported.TubesCursor(canvasRef.current, options);
          }

          // global fallback
          else if (
            typeof window !== "undefined" &&
            (window as any).TubesCursor
          ) {
            app = await (window as any).TubesCursor(canvasRef.current, options);
          }

          if (!app) {
            throw new Error(
              "Unsupported tubes module export shape or initialization failed",
            );
          }

          tubesRef.current = app;
          setLoaded(true);
        } catch (err) {
          console.error("Failed to initialize tubes app:", err);
          throw err;
        }
      } catch (error) {
        console.error("Failed to load tubes background:", error);
      }
    };

    init();

    return () => {
      mounted = false;

      if (tubesRef.current) {
        try {
          tubesRef.current.destroy?.();
        } catch {}
      }
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;

    const colors = randomColors(3);
    const lights = randomColors(4);

    try {
      tubesRef.current.tubes.setColors(colors);
      tubesRef.current.tubes.setLightsColors(lights);
    } catch {}
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full h-full overflow-hidden bg-black ${className ?? ""}`}
    >
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: "none" }}
      />

      {/* Optional gradient overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
