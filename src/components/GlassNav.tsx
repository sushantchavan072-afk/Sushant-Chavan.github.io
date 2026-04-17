import { motion } from "framer-motion";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function GlassNav() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-pill rounded-full px-2 py-2 flex items-center gap-1">
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-mint animate-liquid-pulse" />
          <span className="mono text-xs uppercase tracking-widest text-foreground/90">SC / Rx</span>
        </div>
        <div className="hidden md:flex items-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-foreground/75 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="mailto:sushantchavan072@gmail.com"
          className="ml-1 px-4 py-2 rounded-full text-sm font-medium bg-mint/90 text-primary-foreground hover:bg-mint transition-all hover:scale-105"
        >
          Hire
        </a>
      </div>
    </motion.nav>
  );
}
