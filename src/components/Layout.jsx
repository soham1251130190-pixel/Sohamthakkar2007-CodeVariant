const CURRENT_YEAR = 2026;

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <header className="border-b border-line bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[48rem] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              Fix It First
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Compare repair, reuse, repurpose, replace, and recycle options for broken items.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[48rem] mx-auto px-4 sm:px-6 w-full flex-1 py-8">
        {children}
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        <div className="max-w-[48rem] mx-auto px-4 sm:px-6">
          <p>© {CURRENT_YEAR} Fix It First. Sustainable choices made simple.</p>
        </div>
      </footer>
    </div>
  );
}
