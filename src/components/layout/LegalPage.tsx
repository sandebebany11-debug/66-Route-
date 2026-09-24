import Link from "next/link";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ink px-6 py-28 text-paper">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-champagne-light/80 hover:text-champagne"
        >
          ← Zurück
        </Link>
        <h1 className="mt-6 font-display text-4xl font-light">{title}</h1>
        <div className="prose-invert mt-10 space-y-6 text-sm leading-relaxed text-paper/70">
          {children}
        </div>
      </div>
    </main>
  );
}
