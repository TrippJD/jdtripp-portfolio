import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import { BuildNotes } from "@/components/sections/build-notes";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Launch } from "@/components/sections/launch";
import { Skills } from "@/components/sections/skills";
import { Statement } from "@/components/sections/statement";
import { Stats } from "@/components/sections/stats";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <main>
        <SiteHeader />
        <Hero />
        <Statement />
        <Launch />
        <Stats />
        <Experience />
        <Skills />
        <BuildNotes />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
