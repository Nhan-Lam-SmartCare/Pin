import { useContext } from "react";
import type { PinContextType } from "./types";
import { PinStandaloneContext } from "./PinProviderStandalone";

/**
 * Hook to access the Pin context.
 * This app uses PinProviderStandalone - the old PinProvider has been removed.
 */
export const usePinContext = (): PinContextType => {
  const ctx = useContext(PinStandaloneContext);
  if (!ctx) {
    throw new Error("Pin context not found. Ensure PinProviderStandalone is mounted.");
  }
  return ctx;
};
