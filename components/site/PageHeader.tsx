export default function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="mb-12 max-w-3xl" data-enter>
      <h1 className="display text-5xl text-ink sm:text-7xl">{title}</h1>
      {intro && <p className="mt-5 max-w-[60ch] text-lg text-muted">{intro}</p>}
    </div>
  );
}
