import { useState, useEffect, useCallback } from "react";
import HealthKitModule from "./HealthKitModule";
import type { HealthKitPermissionStatus, JointReplacementData } from "./types";

/**
 * React hook for interacting with HealthKit
 */
export function useHealthKit() {
  const [permissionStatus, setPermissionStatus] =
    useState<HealthKitPermissionStatus>("notDetermined");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jointReplacements, setJointReplacements] = useState<
    JointReplacementData[]
  >([]);

  // Initialize permission status
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        const status = await HealthKitModule.getAuthorizationStatus();
        setPermissionStatus(status);
      } catch (err) {
        console.error("Failed to get HealthKit permission status", err);
      }
    };

    checkPermissionStatus();
  }, []);

  // Request HealthKit authorization
  const requestAuthorization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await HealthKitModule.requestAuthorization();
      const status = await HealthKitModule.getAuthorizationStatus();
      setPermissionStatus(status);
      return status;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to request HealthKit authorization";
      setError(errorMessage);
      return "denied" as HealthKitPermissionStatus;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save joint replacement data
  const saveJointReplacement = useCallback(
    async (data: JointReplacementData) => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await HealthKitModule.saveJointReplacement(data);
        if (success) {
          // Refresh the list after saving
          const updatedList = await HealthKitModule.getJointReplacements();
          setJointReplacements(updatedList);
        }
        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to save joint replacement data";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Load joint replacements
  const loadJointReplacements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await HealthKitModule.getJointReplacements();
      setJointReplacements(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load joint replacement data";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a joint replacement
  const deleteJointReplacement = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await HealthKitModule.deleteJointReplacement(id);
      if (success) {
        // Refresh the list after deletion
        const updatedList = await HealthKitModule.getJointReplacements();
        setJointReplacements(updatedList);
      }
      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete joint replacement";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permissionStatus,
    isLoading,
    error,
    jointReplacements,
    requestAuthorization,
    saveJointReplacement,
    loadJointReplacements,
    deleteJointReplacement,
  };
}
