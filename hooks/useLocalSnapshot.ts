"use client";

import { useEffect, useState } from "react";
import type { LocalSnapshot, LocalSnapshotApiResponse } from "@/types/local-snapshot";

type LocalSnapshotState = {
  snapshot: LocalSnapshot | null;
  isLoading: boolean;
  error: string | null;
};

export function useLocalSnapshot(zip: string): LocalSnapshotState {
  const [state, setState] = useState<LocalSnapshotState>({
    snapshot: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadSnapshot() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/local-snapshot?zip=${zip}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as LocalSnapshotApiResponse;

        if (!response.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Local snapshot is unavailable.");
        }

        setState({ snapshot: data.snapshot, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Local snapshot is unavailable.";
        setState({ snapshot: null, isLoading: false, error: message });
      }
    }

    loadSnapshot();

    return () => controller.abort();
  }, [zip]);

  return state;
}
