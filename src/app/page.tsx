"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ROLES = ["Developer", "Builder", "Digital Liberator", "Reality Architect"];

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; pulse: number; pulseSpeed: number;
    }[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const orbs: {
      x: number; y: number; vx: number; vy: number; radius: number; phase: number;
    }[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 80 + 40,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let animId: number;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        o.phase += 0.008;
        if (o.x < -o.radius) o.x = canvas.width + o.radius;
        if (o.x > canvas.width + o.radius) o.x = -o.radius;
        if (o.y < -o.radius) o.y = canvas.height + o.radius;
        if (o.y > canvas.height + o.radius) o.y = -o.radius;

        const pulse = 0.04 + Math.sin(o.phase) * 0.02;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.radius);
        grad.addColorStop(0, `rgba(234,179,8,${pulse})`);
        grad.addColorStop(0.5, `rgba(234,179,8,${pulse * 0.4})`);
        grad.addColorStop(1, "rgba(234,179,8,0)");
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dynamicOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        const dynamicSize = p.size * (0.8 + Math.sin(p.pulse * 1.3) * 0.2);

        ctx.beginPath();
        ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,179,8,${dynamicOpacity})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1, i + 15).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(234,179,8,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      const scanY = (frame * 0.5) % canvas.height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, "rgba(234,179,8,0)");
      scanGrad.addColorStop(0.5, "rgba(234,179,8,0.03)");
      scanGrad.addColorStop(1, "rgba(234,179,8,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at top right, rgba(234,179,8,0.15) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at bottom left, rgba(234,179,8,0.10) 0%, transparent 65%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.04) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">

        <div style={{ animation: "fadeUp 0.9s ease both 0.1s" }} className="mb-8 relative">
          <div className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 60px rgba(234,179,8,0.4), 0 0 120px rgba(234,179,8,0.15)", borderRadius: "50%" }} />
          <Avatar className="h-28 w-28 ring-2 ring-yellow-400/70 relative z-10">
            <AvatarImage src="https://unavatar.io/twitter/sybimeta" alt="Sybi" />
            <AvatarFallback className="bg-yellow-400/10 text-yellow-400 text-2xl font-bold">SY</AvatarFallback>
          </Avatar>
          <div className="absolute inset-[-10px] rounded-full border border-yellow-400/25 pointer-events-none"
            style={{ animation: "spin 7s linear infinite" }} />
          <div className="absolute inset-[-20px] rounded-full border border-yellow-400/12 pointer-events-none"
            style={{ animation: "spin 13s linear infinite reverse" }} />
          <div className="absolute inset-[-32px] rounded-full border border-yellow-400/06 pointer-events-none"
            style={{ animation: "spin 20s linear infinite" }} />
        </div>

        <h1
          className="text-6xl sm:text-8xl font-black tracking-tight mb-3"
          style={{
            animation: "fadeUp 1s ease both 0.2s",
            fontFamily: "var(--font-geist-sans)",
            color: "#fff",
            textShadow: "0 0 40px rgba(234,179,8,0.3)",
          }}
        >
          SYBI
        </h1>

        <p className="text-yellow-400/60 font-mono text-sm mb-4 tracking-widest"
          style={{ animation: "fadeUp 1s ease both 0.25s" }}>
          @sybimeta
        </p>

        <div className="text-xl sm:text-2xl font-mono text-yellow-400 mb-10 h-8 flex items-center"
          style={{ animation: "fadeUp 1s ease both 0.3s" }}>
          {displayed}
          <span className="ml-0.5 inline-block w-0.5 h-6 bg-yellow-400"
            style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }} />
        </div>

        <div style={{ animation: "fadeUp 1s ease both 0.4s" }}>
          <Button
            asChild
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-all duration-200 px-8 py-2 text-sm tracking-widest uppercase border-0"
            style={{ boxShadow: "0 0 30px rgba(234,179,8,0.4), 0 0 60px rgba(234,179,8,0.15)" }}
          >
            <a href="https://x.com/sybimeta" target="_blank" rel="noopener noreferrer">
              𝕏
            </a>
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: "fadeUp 1s ease both 0.7s" }}>
          <div className="w-px h-10 bg-gradient-to-b from-yellow-400/40 to-transparent"
            style={{ animation: "pulse 2s ease infinite" }} />
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}