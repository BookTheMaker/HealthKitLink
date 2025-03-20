import { NativeModules, Platform } from "react-native";
import type { JointReplacementData } from "./types";

const LINKING_ERROR =
  `The package 'react-native-healthkit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

// Get the native module or provide a mock implementation for non-iOS platforms
const HealthKitNative =
  Platform.OS === "ios"
    ? NativeModules.HealthKit ||
      new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        },
      )
    : {
        // Mock implementation for non-iOS platforms
        requestAuthorization: () => Promise.resolve(false),
        getAuthorizationStatus: () => Promise.resolve("notDetermined"),
        saveJointReplacement: () => Promise.resolve(false),
        getJointReplacements: () => Promise.resolve([]),
        deleteJointReplacement: () => Promise.resolve(false),
      };

export default {
  /**
   * Request HealthKit authorization for joint replacement data
   * @returns Promise resolving to a boolean indicating success
   */
  requestAuthorization: (): Promise<boolean> => {
    return HealthKitNative.requestAuthorization();
  },

  /**
   * Get the current HealthKit authorization status
   * @returns Promise resolving to the authorization status
   */
  getAuthorizationStatus: (): Promise<
    "notDetermined" | "denied" | "authorized"
  > => {
    return HealthKitNative.getAuthorizationStatus();
  },

  /**
   * Save joint replacement data to HealthKit
   * @param data The joint replacement data to save
   * @returns Promise resolving to a boolean indicating success
   */
  saveJointReplacement: (data: JointReplacementData): Promise<boolean> => {
    return HealthKitNative.saveJointReplacement(data);
  },

  /**
   * Get all joint replacements from HealthKit
   * @returns Promise resolving to an array of joint replacement data
   */
  getJointReplacements: (): Promise<JointReplacementData[]> => {
    return HealthKitNative.getJointReplacements();
  },

  /**
   * Delete a joint replacement from HealthKit by ID
   * @param id The ID of the joint replacement to delete
   * @returns Promise resolving to a boolean indicating success
   */
  deleteJointReplacement: (id: string): Promise<boolean> => {
    return HealthKitNative.deleteJointReplacement(id);
  },
};
