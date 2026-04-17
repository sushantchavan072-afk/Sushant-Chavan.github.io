import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import PharmaScene from "./PharmaScene";
import { useIsMobile } from "../hooks/use-mobile";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  // Motion values for left-side text parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  const titleX = useTransform(sx, (v) => 0);
  const titleY = useTransform(sy, (v) => 0);
  const blob1X = useTransform(sx, (v) => v * 40);
  const blob1Y = useTransform(sy, (v) => v * 30);
  const blob2X = useTransform(sx, (v) => v * -55);
  const blob2Y = useTransform(sy, (v) => v * -35);
  const blob3X = useTransform(sx, (v) => v * 25);
  const blob3Y = useTransform(sy, (v) => v * -20);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      // Use window dimensions to avoid expensive layout thrashing on every mouse event
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.current.x = nx;
      pointer.current.y = ny;
      mx.set(nx);
      my.set(ny);
    };

    const handleLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
      mx.set(0);
      my.set(0);
    };

    window.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [mx, my]);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden grain">
      {/* Soft ambient blobs for depth — parallax on cursor */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="absolute top-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-mint/20 blur-3xl animate-liquid-pulse"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y }}
          className="absolute bottom-1/4 right-1/3 h-[380px] w-[380px] rounded-full bg-aqua/20 blur-3xl animate-liquid-pulse"
        />
        <motion.div
          style={{ x: blob3X, y: blob3Y }}
          className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-violet/15 blur-3xl"
        />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-7xl px-6 min-h-[100dvh] flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:items-center ${isMobile ? "pt-24 pb-20" : "pt-32 pb-16 items-center justify-center"}`}
      >
        {/* LEFT — name & intro */}
        <motion.div className="order-2 lg:order-1 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-liquid-pulse" />
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
              B.Pharm · 2023–27 · Pune
            </span>
          </motion.div>

          <h1 className="display text-[clamp(2.5rem,6vw,5.5rem)] text-foreground leading-[1.1]">
            <AnimatedWord text="Sushant" delay={0.25} />
            <br />
            <span className="text-foreground italic inline-block pb-2 text-[1.35em] leading-[0.9]">
              <AnimatedWord text="Chavan." delay={0.55} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-8 text-lg md:text-xl text-foreground/70 leading-relaxed max-w-lg"
          >
            Pharmacy student engineering the bridge between{" "}
            <span className="text-foreground font-medium">clinical precision</span> and{" "}
            <span className="text-foreground font-medium">data-driven systems</span>. Documenting,
            designing & dispensing — one molecule at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.15 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform glow-mint"
            >
              Get in touch
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#experience"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-foreground hover:bg-white/60 transition-colors"
            >
              View work
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — 3D scene driven by shared pointer ref */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`order-1 lg:order-2 relative w-full z-0 ${isMobile ? "min-h-[380px] flex-shrink-0 my-4" : "h-[450px] sm:h-[550px] lg:h-[700px]"}`}
        >
          {/* Unbounded container for 3D elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none">
            <div className="w-full h-full pointer-events-auto">
              <PharmaScene pointer={pointer} isMobile={isMobile} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 mono text-[10px] uppercase tracking-[0.3em] text-foreground/40"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          ↓ scroll
        </motion.span>
      </motion.div>
    </section>
  );
}

function AnimatedWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block whitespace-pre">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
