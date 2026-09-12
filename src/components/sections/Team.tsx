import { team, teamGroupPhoto } from "@/data/content";
import TeamPortrait from "@/components/ui/TeamPortrait";
import ImagePlate from "@/components/ui/ImagePlate";

export default function Team() {
  return (
    <section id="team" className="relative bg-paper py-28 text-ink md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-dark">
            Das Team
          </span>
          <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
            Gesichter hinter
            <br />
            <span className="italic">jedem Schnitt.</span>
          </h2>
        </div>

        <ImagePlate
          src={teamGroupPhoto}
          alt="Das Team von Art of Hair by Simyan"
          cursorLabel="MEET"
          className="mb-16 aspect-[16/9] w-full md:aspect-[21/9]"
        />

        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-x-8">
          {team.map((member, i) => (
            <div key={member.name} className={i % 3 === 1 ? "md:mt-16" : ""}>
              <TeamPortrait member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
