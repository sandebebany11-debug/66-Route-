import ImagePlate from "@/components/ui/ImagePlate";

const lines = ["HYDRATE-ME", "ANGEL", "SHIMMER.SHINE"];

export default function KevinMurphy() {
  return (
    <section className="relative bg-paper py-28 text-ink md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-20">
        <ImagePlate
          src="/images/kevin-murphy/products.jpg"
          alt="Kevin Murphy Pflegeprodukte"
          className="order-2 aspect-[4/5] md:order-1"
        />

        <div className="order-1 md:order-2">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-dark">
            Haarpflege
          </span>
          <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
            Care is part
            <br />
            <span className="italic">of the cut.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">
            Wir vertrauen auf Kevin Murphy — Pflegerituale, die auf die
            Bedürfnisse Ihres Haars abgestimmt sind, u.&nbsp;a. aus den
            Linien {lines.join(", ")}. Weil ein Schnitt erst mit der
            richtigen Pflege vollendet ist.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink/70">
            {[
              "Individuelle Pflegeberatung bei jedem Termin",
              "Kopfhaut- und Intensivbehandlungen",
              "Produkte zum Mitnehmen für zu Hause",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-champagne-dark" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
