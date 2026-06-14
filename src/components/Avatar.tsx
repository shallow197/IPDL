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
  /** Optional photo URL; falls back to coloured initials if it fails to load. */
  src?: string;
  /** Initials shown when no photo is available. */
  seed: string;
  /** Diameter in pixels. */
  size?: number;
  className?: string;
}

export default function Avatar({ name, src, seed, size = 56, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[hashIndex(name, GRADIENTS.length)];
  const showImg = src && !failed;

  return (
    <span
      style={{ height: size, width: size }}
      className={`relative flex-none rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-extrabold ring-2 ring-white/10 ${className}`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{ fontSize: Math.round(size * 0.36) }} className="tracking-tight drop-shadow-sm">
          {seed}
        </span>
      )}
    </span>
  );
}
