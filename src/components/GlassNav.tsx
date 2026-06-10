import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Milo", href: "#chatbot" },
  { label: "Contact", href: "#contact" },
];

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function GlassNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
    >
      <div className="glass-pill rounded-full px-2 py-2 flex items-center gap-1">
        <div className="hidden md:flex items-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(l.href);
              }}
              className="px-4 py-2 text-sm text-foreground/75 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="mailto:sushantchavan072@gmail.com"
          className="hidden md:block ml-1 px-4 py-2 rounded-full text-sm font-medium bg-mint/90 text-primary-foreground hover:bg-mint transition-all hover:scale-105"
        >
          Hire
        </a>
        <button
          className="md:hidden p-2.5 rounded-full hover:bg-white/10 transition-colors text-foreground mx-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 flex flex-col items-center glass-pill rounded-3xl p-3 min-w-[220px]"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {links.map((l) => (
              <div key={l.href} className="relative w-full">
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setHoveredLink(null);
                    scrollToSection(l.href);
                  }}
                  onMouseEnter={() => setHoveredLink(l.href)}
                  onTouchStart={() => setHoveredLink(l.href)}
                  className="block w-full text-center px-4 py-3 text-sm text-foreground/90 transition-colors z-10 relative"
                >
                  {l.label}
                </a>
                {hoveredLink === l.href && (
                  <motion.div
                    layoutId="mobile-nav-stroke"
                    className="absolute inset-0 border border-mint/50 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
