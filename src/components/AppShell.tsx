export function AppShell() {
  return (
    <main className="min-h-dvh bg-stone-50 px-4 py-6 text-stone-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">Foundation</p>
          <h1 className="mt-3 text-3xl font-semibold">Calculator app shell</h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            React, TypeScript, Tailwind CSS, linting, formatting, and responsive viewport
            configuration are ready for the feature issues.
          </p>
        </div>
      </section>
    </main>
  );
}
