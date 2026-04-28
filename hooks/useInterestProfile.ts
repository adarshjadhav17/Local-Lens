"use client";

import { useSyncExternalStore } from "react";
import {
  getEmptyInterestProfile,
  interestProfileChangeEvent,
  readInterestProfile
} from "@/lib/interests";

function subscribeToInterestProfile(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(interestProfileChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(interestProfileChangeEvent, onStoreChange);
  };
}

export function useInterestProfile() {
  return useSyncExternalStore(
    subscribeToInterestProfile,
    readInterestProfile,
    getEmptyInterestProfile
  );
}
