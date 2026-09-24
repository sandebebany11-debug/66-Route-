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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MachineExperience />
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
