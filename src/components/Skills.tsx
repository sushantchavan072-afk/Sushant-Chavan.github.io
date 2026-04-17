import { motion } from "framer-motion";

const groups = [
  {
    title: "Data & Analytics",
    color: "mint",
    skills: ["Data Analysis", "SAS Programming", "Tableau", "Log Analysis", "Excel"],
  },
  {
    title: "Gen AI & IT",
    color: "aqua",
    skills: ["Python", "LLMs", "Claude", "Gemini", "Computer Networking"],
  },
  {
    title: "Pharmaceutical",
    color: "violet",
    skills: ["SOP Writing", "QA / QC", "GMP Awareness", "Regulatory Docs", "Reporting"],
  },
  {
    title: "Communication",
    color: "coral",
    skills: [
      "Public Relations",
      "English · Hindi · Marathi · Gujarati",
      "Canva Design",
      "Editorial",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-16 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-16 mb-10 md:mb-16 items-end">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
              03 — Composition
            </div>
            <h2 className="display text-5xl md:text-7xl">
              Active <span className="italic text-aurora">ingredients.</span>
            </h2>
          </div>
          <p className="text-lg text-foreground/70 max-w-md md:justify-self-end">
            A curated stack across pharma practice, data science, and the AI tooling that connects
            them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {groups.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group"
            >
              {/* Pill accent */}
              <div
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ background: `var(--${g.color})` }}
              />

              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `var(--${g.color})` }}
                  />
                  <h3 className="display text-2xl">{g.title}</h3>
                </div>
                <ul className="space-y-2">
                  {g.skills.map((s) => (
                    <li
                      key={s}
                      className="text-sm text-foreground/75 flex items-center gap-2 py-1 border-b border-white/5 last:border-0"
                    >
                      <span className="mono text-[10px] text-foreground/40">
                        {String(g.skills.indexOf(s) + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
