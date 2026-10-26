import { useState } from 'react';
import { Filter, Plus, X } from 'lucide-react';

export default function HabitsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <section className="mx-auto w-full max-w-6xl px-2 py-6 text-[#282828] sm:px-4">
      {/* Page header */}
      <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#72726f]">
            Your daily practices
          </p>

          <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">
            Habits
          </h1>

          <p className="mt-3 text-sm text-[#626260]">
            Build routines that support the life you want.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d1d1cd] bg-white px-4 text-sm hover:border-[#72726f]"
          >
            <Filter size={16} />
            Filter
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#fa3600] px-4 text-sm font-medium text-white transition-colors hover:bg-[#d92f00]"
          >
            <Plus size={17} />
            New habit
          </button>
        </div>
      </header>

      {/* Temporary modal shell. The form comes in a later chunk. */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"
          onClick={() => setIsCreateOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-habit-title"
            className="w-full max-w-lg rounded-xl border border-[#d1d1cd] bg-white p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#72726f]">
                  New practice
                </p>

                <h2
                  id="create-habit-title"
                  className="mt-2 text-2xl font-normal"
                >
                  Create a habit
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close create habit dialog"
                className="rounded-md p-2 hover:bg-[#f2f2f1]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-5 text-sm text-[#626260]">
              We'll add the habit form and API submission in the next step.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}
