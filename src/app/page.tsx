"use client";

import { useState } from "react";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import Showreel from "@/components/sections/Showreel";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import ReelTimeline from "@/components/sections/ReelTimeline";
import AIFilmWall from "@/components/sections/AIFilmWall";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <Navbar />

      <main>
        <Hero />
        <Showreel />
        <About />
        <Gallery />
        <ReelTimeline />
        <AIFilmWall />
        <Experience />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
