/**
 * MaterialManager Module
 *
 * This module provides all the building blocks for the MaterialManager component.
 * Import from this index file for cleaner imports.
 */

// Types
export * from "./types";

// Utilities
export * from "./utils";

// Hooks
export { useMaterialData } from "./useMaterialData";
export type { UseMaterialDataReturn, MaterialStats } from "./useMaterialData";

export { useMaterialModals } from "./useMaterialModals";
export type { UseMaterialModalsReturn } from "./useMaterialModals";
