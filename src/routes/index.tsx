import { createFileRoute } from "@tanstack/react-router";
import GlassNav from "@/components/GlassNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sushant Chavan — Pharmacy · Data · Design" },
      {
        name: "description",
        content:
          "Portfolio of Sushant Chavan — B.Pharmacy student blending pharmaceutical practice, data analytics, and editorial design.",
      },
      { property: "og:title", content: "Sushant Chavan — Pharma Portfolio" },
      {
        property: "og:description",
        content: "Liquid glass portfolio of a pharmacy student & data-driven editor.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="relative">
      <GlassNav />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
