import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MachineExperience from "@/components/sections/MachineExperience";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";
import Salon from "@/components/sections/Salon";
import KevinMurphy from "@/components/sections/KevinMurphy";
import Pricing from "@/components/sections/Pricing";
import Booking from "@/components/sections/Booking";
import { hasClipperModel } from "@/lib/model";

export default function Home() {
  const hasCustomModel = hasClipperModel();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MachineExperience hasCustomModel={hasCustomModel} />
        <Services />
        <Team />
        <Salon />
        <KevinMurphy />
        <Pricing />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
