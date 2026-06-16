"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobeThreeJsPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamic import de Three.js depuis CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => {
      if (!(window as any).THREE) return;

      const THREE = (window as any).THREE;
      const container = containerRef.current;
      if (!container) return;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(600, 500);
      renderer.setClearColor(0x1a1a2e, 1);
      container.appendChild(renderer.domElement);

      // Globe
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1a5080";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#2d5016";
        ctx.beginPath();
        ctx.ellipse(200, 150, 80, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(350, 250, 100, 120, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      // Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      camera.position.z = 5;

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002;
        renderer.render(scene, camera);
      };
      animate();

      // Cleanup
      return () => {
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        container.removeChild(renderer.domElement);
      };
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/preview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Globe Three.js</h1>
        <p className="text-slate-400 mb-8">3D réaliste, rotation fluide, textures satellites possibles</p>

        <div className="flex justify-center mb-12 bg-slate-900/30 rounded-lg p-4">
          <div ref={containerRef} className="w-full max-w-2xl" />
        </div>

        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">Caractéristiques Three.js</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Globe 3D réaliste</li>
            <li>✓ Rotation fluide et naturelle</li>
            <li>✓ Textures satellites possibles</li>
            <li>✓ Interactions avancées (click, zoom)</li>
            <li>✗ Libraire très lourde (~200KB)</li>
            <li>✗ GPU intensive (batterie mobile)</li>
            <li>✗ Complexité pour simple vitrine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
