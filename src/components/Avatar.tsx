"use client";

import React, { useState } from "react";

// A palette of vivid gradients; the chosen one is derived from the name so each
// member gets a stable, distinct, colourful avatar even without a photo.
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-green-500 to-emerald-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-sky-600",
  "from-teal-500 to-emerald-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-lime-500 to-green-600",
];

function hashIndex(str: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

interface AvatarProps {
  name: string;
  /** Optional photo URL; the coloured initials show through if it can't load. */
  src?: string;
  /** Initials shown when no photo is available. */
  seed: string;
  /** Diameter in pixels. */
  size?: number;
  /**
   * CSS object-position for the photo inside the circle.
   * Default "center" centres the photo. For a photo where the head is cut off,
   * try "center 20%", "top", or "center 30%" to reveal more of the top.
   */
  objectPosition?: string;
  /**
   * How the photo fills the circle.
   * "cover" (default) fills the whole circle, cropping the overflow.
   * "contain" shows the ENTIRE photo with no cropping (gradient may show in corners).
   */
  fit?: "cover" | "contain";
  className?: string;
}

/**
 * Robust avatar: the coloured initials are ALWAYS rendered underneath, and the
 * photo (when available) is overlaid and fades in on load. This avoids any
 * conditional img↔initials swap, so a slow or failed image can never leave a
 * blank/flickering avatar — the photo simply appears over the initials.
 */
export default function Avatar({
  name,
  src,
  seed,
  size = 56,
  objectPosition = "center",
  fit = "cover",
  className = "",
}: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[hashIndex(name, GRADIENTS.length)];

  return (
    <span
      style={{ height: size, width: size }}
      className={`relative flex-none rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-extrabold ring-2 ring-white/10 ${className}`}
    >
      <span
        style={{ fontSize: Math.round(size * 0.36) }}
        className="tracking-tight drop-shadow-sm select-none"
      >
        {seed}
      </span>
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ objectPosition }}
          className={`absolute inset-0 h-full w-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          } transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}