import { motion } from "framer-motion";

const images = [
  {
    src: "/Yearbook.png",
    label: "Yearbook cover",
    href: "https://heyzine.com/flip-book/34f5672fcb.html",
  },
  {
    src: "/Yearbook (1).png",
    label: "Yearbook spread 1",
    href: "https://heyzine.com/flip-book/76b43becb7.html",
  },
  {
    src: "/Yearbook (2).png",
    label: "Yearbook spread 2",
    href: "https://heyzine.com/flip-book/a294793e0d.html",
  },
  { src: "/Yearbook (3).png", label: "Yearbook spread 3" },
];

export default function Work() {
  return (
    <section id="work" className="relative py-16 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-16 mb-10 md:mb-16 items-end">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-mint mb-6">
              04 — Checkout My Work
            </div>
            <h2 className="display text-5xl md:text-7xl">
              Checkout my <span className="italic text-aurora">work.</span>
            </h2>
          </div>
          <p className="text-lg text-foreground/70 max-w-md md:justify-self-end">
            Tap on newsletters to view them. These yearbook images highlight editorial design and
            newsletter work from recent projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-8">
          {images.map((image, index) => {
            const isClickable = Boolean(image.href);
            const Wrapper = isClickable ? motion.a : motion.div;
            const wrapperProps = isClickable
              ? {
                  href: image.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "cursor-pointer",
                }
              : {};

            return (
              <Wrapper
                key={image.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                {...wrapperProps}
              >
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-full max-h-[320px] sm:max-h-[360px] object-contain rounded-3xl transition-transform duration-500 hover:scale-105 mx-auto"
                />
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
