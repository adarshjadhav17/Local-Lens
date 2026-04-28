import type { FormEvent } from "react";

export function ZipSearchForm({
  zipInput,
  validationError,
  isLocating,
  onZipInputChange,
  onUseCurrentLocation,
  onSubmit
}: {
  zipInput: string;
  validationError: string | null;
  isLocating: boolean;
  onZipInputChange: (value: string) => void;
  onUseCurrentLocation: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="w-full rounded-lg border border-ink/10 bg-white p-3 shadow-soft sm:max-w-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="zip">
          ZIP code
        </label>
        <input
          id="zip"
          inputMode="numeric"
          maxLength={5}
          value={zipInput}
          onChange={(event) => onZipInputChange(event.target.value)}
          placeholder="Enter ZIP code"
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? "zip-error" : undefined}
          className="min-h-12 flex-1 rounded-md border border-ink/15 px-4 text-base font-semibold outline-none transition focus:border-tide focus:ring-4 focus:ring-tide/15 aria-[invalid=true]:border-sunrise aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-sunrise/15"
        />
        <button
          type="submit"
          className="min-h-12 rounded-md bg-ink px-5 text-sm font-bold text-white transition hover:bg-tide focus:outline-none focus:ring-4 focus:ring-tide/25"
        >
          Search
        </button>
      </div>
      <button
        type="button"
        className="mt-3 min-h-11 w-full rounded-md border border-tide/30 bg-white px-4 text-sm font-bold text-tide transition hover:border-tide hover:bg-tide/5 focus:outline-none focus:ring-4 focus:ring-tide/15 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLocating}
        onClick={onUseCurrentLocation}
      >
        {isLocating ? "Finding your ZIP..." : "Use my location"}
      </button>
      {validationError ? (
        <p id="zip-error" className="mt-2 text-sm font-bold text-sunrise">
          {validationError}
        </p>
      ) : null}
    </form>
  );
}
