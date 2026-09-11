import ImagePlate from "@/components/ui/ImagePlate";
import RevealText from "@/components/ui/RevealText";

export default function Salon() {
  return (
    <section id="salon" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-light/80">
            Der Salon
          </span>
          <RevealText
            as="h2"
            className="mx-auto mt-4 max-w-3xl font-display text-4xl font-light text-paper sm:text-6xl"
          >
            A place for your style.
          </RevealText>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-paper/60">
            Mitten in Lützenkirchen, Leverkusen — ein Raum aus Licht, Material und
            Ruhe. Kein Wartezimmer. Ein Ort, an dem Sie ankommen.
          </p>
        </div>

        <div className="grid grid-cols-6 gap-4 md:gap-6">
          <ImagePlate
            src="/images/salon/interior-wide.jpg"
            alt="Salon Innenraum"
            className="col-span-6 aspect-[16/8] md:col-span-4"
          />
          <ImagePlate
            src="/images/salon/details.jpg"
            alt="Details & Materialien"
            className="col-span-3 aspect-[3/4] md:col-span-2"
          />
          <ImagePlate
            src="/images/salon/products.jpg"
            alt="Pflegeprodukte"
            className="col-span-3 aspect-square md:col-span-2"
          />
          <ImagePlate
            src="/images/salon/mirror-station.jpg"
            alt="Arbeitsplatz"
            className="col-span-6 aspect-[16/9] md:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}
