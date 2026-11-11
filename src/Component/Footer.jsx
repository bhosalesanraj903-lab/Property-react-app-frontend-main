export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100 mt-16">
      <div className="h-1 bg-brass" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-serif text-lg text-cream tracking-wide">EstateHub</span>
        <p className="text-sm text-brand-300 m-0">© {new Date().getFullYear()} EstateHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
