import { motion } from "framer-motion";

const stats = [
  { k: "Year", v: "3rd", color: "mint" },
  { k: "GPA Era", v: "2023–27", color: "aqua" },
  { k: "Members Reached", v: "2.7K+", color: "violet" },
  { k: "Languages", v: "4", color: "coral" },
];

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="grid md:grid-cols-12 gap-10"
        >
          <div className="md:col-span-4">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
              01 — About
            </div>
            <h2 className="display text-5xl md:text-7xl text-foreground">
              A formulation
              <br />
              <span className="italic text-aurora">of disciplines.</span>
            </h2>
          </div>

          <div className="md:col-span-7 md:col-start-6 space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed text-foreground/85 display">
              B.Pharmacy student at Sinhgad College of Pharmacy with hands-on expertise in{" "}
              <span className="text-mint">professional documentation</span>, data management, and
              organizational communication — transferable to QA/QC, regulatory & GMP environments.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-[var(--card-accent)] transition-all duration-500 hover:scale-[1.02]"
                  style={{ "--card-accent": `var(--${s.color})` } as React.CSSProperties}
                >
                  {/* Moving Color Orb */}
                  <motion.div
                    animate={{
                      left: ["0%", "100%", "0%"],
                      top: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      left: { duration: 8 + i, ease: "easeInOut", repeat: Infinity },
                      top: { duration: 11 + i, ease: "easeInOut", repeat: Infinity },
                    }}
                    className="absolute w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none z-0"
                    style={{ background: `var(--${s.color})`, transform: "translate(-50%, -50%)" }}
                  />
                  <div className="relative z-10">
                    <div className="display text-3xl text-foreground">{s.v}</div>
                    <div className="mono text-[10px] uppercase tracking-widest text-foreground/60 mt-2">
                      {s.k}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
