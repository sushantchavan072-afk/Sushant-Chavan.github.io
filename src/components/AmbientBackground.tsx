import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // Upward drift bias
    this.maxLife = 40 + Math.random() * 30;
    this.life = this.maxLife;
    this.size = Math.random() * 2.5 + 0.5;
    // Theme colors: mint, aqua, violet
    const colors = ["167, 240, 217", "191, 224, 255", "216, 197, 245"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
    this.size *= 0.96; // Physics shrink friction
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.size <= 0.1) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.life / this.maxLife})`;
    ctx.fill();
  }
}

export function AmbientBackground() {
  const mx = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const my = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use spring physics for liquid, smooth cursor trailing
  const smoothX = useSpring(mx, { damping: 40, stiffness: 150, mass: 0.8 });
  const smoothY = useSpring(my, { damping: 40, stiffness: 150, mass: 0.8 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      // Spawn 2 magic dust particles per movement frame
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      particles = particles.filter((p) => p.life > 0 && p.size > 0.1);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mx, my]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden mix-blend-screen bg-black/5">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 ml-[-300px] mt-[-300px]"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 240, 217, 0.15) 0%, rgba(191, 224, 255, 0.05) 50%, rgba(0, 0, 0, 0) 70%)",
          x: smoothX,
          y: smoothY,
        }}
      />
    </div>
  );
}
