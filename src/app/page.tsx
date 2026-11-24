import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import { BuildNotes } from "@/components/sections/build-notes";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Statement } from "@/components/sections/statement";
import { Stats } from "@/components/sections/stats";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Statement />
      <Stats />
      <Experience />
      <Skills />
      <BuildNotes />
      <About />
    </main>
  );
}
