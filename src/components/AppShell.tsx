import { Calculator } from './calculator/Calculator';

export function AppShell() {
  return (
    <main className="flex min-h-dvh overflow-hidden bg-cream-100 px-3 py-2 text-cocoa-600 sm:px-6 sm:py-6">
      <h1 className="sr-only">Calculator</h1>
      <div className="mx-auto flex h-[calc(100dvh-1rem)] w-full items-center justify-center sm:h-[calc(100dvh-3rem)]">
        <Calculator />
      </div>
    </main>
  );
}
