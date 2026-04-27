export function DiscoverySection({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-tide">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
