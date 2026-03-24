"use client";

import { useState } from "react";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import Showreel from "@/components/sections/Showreel";
import About from "@/components/sections/About";
import WorkGrid from "@/components/sections/WorkGrid";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <Navbar />

      <main>
        <Hero />
        <SectionDivider variant="particles" color="cyan" />
        <Showreel />
        <SectionDivider variant="line" color="cyan" />
        <About />
        <SectionDivider variant="particles" color="amber" />
        <WorkGrid />
        <SectionDivider variant="line" color="amber" />
        <Experience />
        <SectionDivider variant="particles" color="cyan" />
        <Skills />
        <SectionDivider variant="line" color="purple" />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
