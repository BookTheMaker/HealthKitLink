import { useState, useEffect, useCallback } from "react";
import healthKit, {
  HealthKitPermissionStatus,
  JointReplacementData,
} from "../lib/healthkit";

export function useHealthKit() {
  const [permissionStatus, setPermissionStatus] =
    useState<HealthKitPermissionStatus>(healthKit.getAuthorizationStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jointReplacements, setJointReplacements] = useState<
    JointReplacementData[]
  >([]);

  // Update permission status when it changes
  useEffect(() => {
    const unsubscribe = healthKit.addStatusListener((status) => {
      setPermissionStatus(status);
    });

    return unsubscribe;
  }, []);

  // Request HealthKit authorization
  const requestAuthorization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await healthKit.requestAuthorization();
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

  // Simulate denying permission (for testing)
  const denyAuthorization = useCallback(() => {
    healthKit.denyAuthorization();
    setPermissionStatus("denied");
  }, []);

  // Reset permission status (for testing)
  const resetAuthorization = useCallback(() => {
    healthKit.resetAuthorization();
    setPermissionStatus("notDetermined");
  }, []);

  // Save joint replacement data
  const saveJointReplacement = useCallback(
    async (data: JointReplacementData) => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await healthKit.saveJointReplacement(data);
        if (success) {
          // Refresh the list after saving
          const updatedList = await healthKit.getJointReplacements();
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
      const data = await healthKit.getJointReplacements();
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
      const success = await healthKit.deleteJointReplacement(id);
      if (success) {
        // Refresh the list after deletion
        const updatedList = await healthKit.getJointReplacements();
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
    denyAuthorization,
    resetAuthorization,
    saveJointReplacement,
    loadJointReplacements,
    deleteJointReplacement,
  };
}
