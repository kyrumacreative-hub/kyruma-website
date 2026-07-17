import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import SelectedWork from "@/components/sections/SelectedWork";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Statement />
        <Process />
        <Services />
        <SelectedWork />
        <Contact />
      </main>

      <Footer />
    </>
  );
}