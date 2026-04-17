import { motion } from "framer-motion";

const items = [
  {
    year: "2025–26",
    role: "District Editor",
    org: "Rotary International · District 3131",
    points: [
      "Distribute official newsletters & reports to 2,700+ members",
      "Maintain compliant documentation of meetings & projects",
      "Coordinate club teams to publish error-free communications",
    ],
    accent: "mint",
  },
  {
    year: "Current",
    role: "PR Officer & Editor",
    org: "Rotaract Club of SCOP",
    points: [
      "Own multi-platform comms strategy & public image",
      "Draft press releases, social content & internal announcements",
      "Bridge alumni, healthcare partners & community stakeholders",
    ],
    accent: "aqua",
  },
  {
    year: "2024–25",
    role: "Editor",
    org: "Rotaract Club of SCOP",
    points: [
      "Curated monthly newsletters & event reports",
      "Compiled district-level activity submissions",
      "Designed flyers & posters for health camps",
    ],
    accent: "violet",
  },
];

const certs = [
  { date: "Mar 2026", name: "Deloitte Data Analytics", platform: "Forage" },
  { date: "Mar 2026", name: "Walmart Pharmacy Technician", platform: "Forage" },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-16 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
          02 — Trials & Practice
        </div>
        <h2 className="display text-5xl md:text-7xl mb-16">
          Experience, <span className="italic text-aurora">administered.</span>
        </h2>

        <div className="space-y-5">
          {items.map((item, i) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass rounded-3xl p-6 md:p-8 grid md:grid-cols-12 gap-6 group hover:bg-white/[0.06] transition-colors"
            >
              <div className="md:col-span-2 flex md:flex-col items-baseline gap-3">
                <div
                  className="h-3 w-3 rounded-full animate-liquid-pulse"
                  style={{ background: `var(--${item.accent})` }}
                />
                <span className="mono text-xs uppercase tracking-widest text-foreground/70">
                  {item.year}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="display text-3xl text-foreground">{item.role}</h3>
                <p className="mono text-xs text-foreground/55 mt-2 uppercase tracking-wider">
                  {item.org}
                </p>
              </div>
              <ul className="md:col-span-6 space-y-3 text-foreground/75 text-sm md:text-base">
                {item.points.map((p) => (
                  <li key={p} className="relative pl-5 leading-relaxed">
                    <span className="absolute left-0 top-0 text-mint text-xl leading-[1.2]">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-aqua mb-6">
            Certified Simulations
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {certs.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
              >
                <div>
                  <div className="display text-2xl">{c.name}</div>
                  <div className="mono text-xs text-foreground/55 mt-1">
                    {c.platform} · {c.date}
                  </div>
                </div>
                <a
                  href="https://drive.google.com/file/d/17M2_x2Alr1f1rS4k9-eSK41rzEj_j9Tb/view?usp=sharing"
                  download
                  title={`Download ${c.name} Certificate`}
                  className="h-12 w-12 rounded-full glass-pill flex items-center justify-center text-mint hover:bg-mint/10 transition-colors cursor-pointer shrink-0"
                >
                  <span className="group-hover:hidden">✓</span>
                  <span className="hidden group-hover:block font-bold">↓</span>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Resume Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 flex flex-col items-center justify-center text-center"
          >
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-violet mb-4">
              Complete Curriculum Vitae
            </div>
            <a
              href="https://drive.google.com/file/d/1NvaMHBWbeOSalY9ZqJJB5tZTpzAZZTQa/view?usp=sharing"
              download
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full glass text-lg font-medium hover:scale-105 transition-transform glow-aqua text-foreground"
            >
              Download Resume
              <span className="transition-transform group-hover:translate-y-1">↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
