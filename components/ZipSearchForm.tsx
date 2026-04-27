import type { FormEvent } from "react";

export function ZipSearchForm({
  zipInput,
  onZipInputChange,
  onSubmit
}: {
  zipInput: string;
  onZipInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-soft sm:max-w-md sm:flex-row"
    >
      <label className="sr-only" htmlFor="zip">
        ZIP code
      </label>
      <input
        id="zip"
        inputMode="numeric"
        maxLength={5}
        pattern="[0-9]{5}"
        value={zipInput}
        onChange={(event) => onZipInputChange(event.target.value)}
        placeholder="Enter ZIP code"
        className="min-h-12 flex-1 rounded-md border border-ink/15 px-4 text-base font-semibold outline-none transition focus:border-tide focus:ring-4 focus:ring-tide/15"
      />
      <button
        type="submit"
        className="min-h-12 rounded-md bg-ink px-5 text-sm font-bold text-white transition hover:bg-tide focus:outline-none focus:ring-4 focus:ring-tide/25"
      >
        Search
      </button>
    </form>
  );
}
