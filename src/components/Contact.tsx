import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden"
        >
          {/* Liquid blobs */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-mint/30 blur-3xl animate-liquid-pulse" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-aqua/30 blur-3xl animate-liquid-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />

          <div className="relative">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
              04 — Prescription
            </div>
            <h2 className="display text-5xl md:text-8xl mb-10">
              Let's <span className="italic text-aurora">collaborate.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <a
                href="mailto:sushantchavan072@gmail.com"
                className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
              >
                <div className="mono text-[10px] uppercase tracking-widest text-foreground/55 mb-2">
                  Email
                </div>
                <div className="text-sm md:text-base text-foreground group-hover:text-mint transition-colors break-all">
                  sushantchavan072@gmail.com
                </div>
              </a>
              <a
                href="tel:+919529936483"
                className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
              >
                <div className="mono text-[10px] uppercase tracking-widest text-foreground/55 mb-2">
                  Phone
                </div>
                <div className="text-base text-foreground group-hover:text-mint transition-colors">
                  +91 95299 36483
                </div>
              </a>
              <div className="glass rounded-2xl p-5">
                <div className="mono text-[10px] uppercase tracking-widest text-foreground/55 mb-2">
                  Location
                </div>
                <div className="text-base text-foreground">Dahanu · Palghar · MH</div>
              </div>
            </div>

            <a
              href="mailto:sushantchavan072@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-mint text-primary-foreground font-medium hover:scale-105 transition-transform glow-mint"
            >
              Start a conversation
              <span className="text-xl">→</span>
            </a>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-foreground/50 mono text-[10px] uppercase tracking-widest">
          <div>© 2026 Sushant Chavan · 2026</div>
          <div>Crafted with care · Sushant Suresh Chavan</div>
        </div>
      </div>
    </section>
  );
}
