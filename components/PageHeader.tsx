import { ZipSearchForm } from "@/components/ZipSearchForm";

export function PageHeader({
  zipInput,
  validationError,
  onZipInputChange,
  onSubmit
}: React.ComponentProps<typeof ZipSearchForm>) {
  return (
    <header className="flex flex-col gap-5 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-tide">Nearcast</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Discover what is happening around you
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-ink/70">
          Enter a ZIP code to preview a local snapshot for weather, traffic, events, new spots,
          and nearby offers.
        </p>
      </div>

      <ZipSearchForm
        zipInput={zipInput}
        validationError={validationError}
        onZipInputChange={onZipInputChange}
        onSubmit={onSubmit}
      />
    </header>
  );
}
