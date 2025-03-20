/**
 * Types for the HealthKit module
 */

/**
 * Joint replacement data structure
 */
export interface JointReplacementData {
  id: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  implantDate: string;
  location: string;
  surgeon: string;
  hospital: string;
  notes?: string;
}

/**
 * HealthKit permission status
 */
export type HealthKitPermissionStatus =
  | "notDetermined"
  | "denied"
  | "authorized";

/**
 * HealthKit error
 */
export interface HealthKitError {
  code: string;
  message: string;
  domain?: string;
}
