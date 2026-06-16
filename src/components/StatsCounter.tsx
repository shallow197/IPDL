"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export default function StatsCounter({ value, label, suffix = "+", duration = 1500 }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 40;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-stat-number tracking-tight">
        {count.toLocaleString("fr-FR")}
        <span>{suffix}</span>
      </div>
      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">{label}</div>
    </div>
  );
}
