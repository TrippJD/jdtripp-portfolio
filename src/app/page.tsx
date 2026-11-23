import { Hero } from "@/components/hero/hero";
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
    </main>
  );
}
