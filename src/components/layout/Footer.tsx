import { salon } from "@/data/content";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Footer() {
  return (
    <footer className="relative bg-ink pt-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-display text-4xl font-light leading-tight text-paper sm:text-6xl">
          Ready for your
          <br />
          <span className="italic text-champagne-light">next look?</span>
        </h2>
        <div className="mt-10">
          <MagneticButton href={`tel:${salon.phoneHref}`} cursorLabel="BOOK">
            Termin vereinbaren
          </MagneticButton>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-7xl border-t border-line px-6 py-12">
        <div className="grid gap-10 text-sm text-paper/60 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-lg text-paper">{salon.name}</p>
            <p className="mt-3 leading-relaxed">
              {salon.address.street}
              <br />
              {salon.address.zip} {salon.address.city}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne-light/80">
              Kontakt
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a href={`tel:${salon.phoneHref}`} className="hover:text-paper">
                  {salon.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${salon.email}`} className="hover:text-paper">
                  {salon.email}
                </a>
              </li>
              <li>
                <a
                  href={salon.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-paper"
                >
                  {salon.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne-light/80">
              Öffnungszeiten
            </p>
            <ul className="mt-3 space-y-1.5">
              {salon.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne-light/80">
              Rechtliches
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a href="/impressum" className="hover:text-paper">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="hover:text-paper">
                  Datenschutz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-paper/40 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {salon.name}
          </span>
          <span>Friseur Leverkusen · Lützenkirchen</span>
        </div>
      </div>
    </footer>
  );
}
