import Foundation
import HealthKit

@objc(HealthKit)
class HealthKit: NSObject {
  
  private let healthStore = HKHealthStore()
  private let jointReplacementType = HKObjectType.documentType(forIdentifier: HKDocumentTypeIdentifier.medicalDevice)!
  
  // MARK: - Authorization
  
  @objc(requestAuthorization:rejecter:)
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("error", "HealthKit is not available on this device", nil)
      return
    }
    
    // Define the types we want to read and write
    let typesToShare: Set<HKSampleType> = [jointReplacementType]
    let typesToRead: Set<HKObjectType> = [jointReplacementType]
    
    // Request authorization
    healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { (success, error) in
      if let error = error {
        reject("error", "Failed to request HealthKit authorization: \(error.localizedDescription)", error)
        return
      }
      resolve(success)
    }
  }
  
  @objc(getAuthorizationStatus:rejecter:)
  func getAuthorizationStatus(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
      resolve("notDetermined")
      return
    }
    
    let status = healthStore.authorizationStatus(for: jointReplacementType)
    
    switch status {
    case .sharingAuthorized:
      resolve("authorized")
    case .sharingDenied:
      resolve("denied")
    default:
      resolve("notDetermined")
    }
  }
  
  // MARK: - Joint Replacement Data
  
  @objc(saveJointReplacement:resolver:rejecter:)
  func saveJointReplacement(_ data: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("error", "HealthKit is not available on this device", nil)
      return
    }
    
    // Create metadata for the joint replacement
    let metadata: [String: Any] = [
      HKMetadataKeyMedicalDeviceSerialNumber: data["serialNumber"] as? String ?? "",
      "id": data["id"] as? String ?? UUID().uuidString,
      "type": data["type"] as? String ?? "",
      "manufacturer": data["manufacturer"] as? String ?? "",
      "model": data["model"] as? String ?? "",
      "location": data["location"] as? String ?? "",
      "surgeon": data["surgeon"] as? String ?? "",
      "hospital": data["hospital"] as? String ?? "",
      "notes": data["notes"] as? String ?? ""
    ]
    
    // Parse the implant date
    let dateFormatter = ISO8601DateFormatter()
    let implantDate = dateFormatter.date(from: data["implantDate"] as? String ?? "") ?? Date()
    
    // Create the joint replacement sample
    let jointReplacement = HKDocumentSample(
      type: jointReplacementType,
      startDate: implantDate,
      endDate: implantDate,
      metadata: metadata
    )
    
    // Save the joint replacement to HealthKit
    healthStore.save(jointReplacement) { (success, error) in
      if let error = error {
        reject("error", "Failed to save joint replacement: \(error.localizedDescription)", error)
        return
      }
      resolve(success)
    }
  }
  
  @objc(getJointReplacements:rejecter:)
  func getJointReplacements(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
      resolve([])
      return
    }
    
    // Create a predicate to get all joint replacements
    let predicate = HKQuery.predicateForSamples(withStart: nil, end: nil, options: .strictStartDate)
    
    // Create the query
    let query = HKSampleQuery(sampleType: jointReplacementType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { (query, samples, error) in
      if let error = error {
        reject("error", "Failed to get joint replacements: \(error.localizedDescription)", error)
        return
      }
      
      guard let samples = samples as? [HKDocumentSample] else {
        resolve([])
        return
      }
      
      // Convert the samples to a format that can be sent to React Native
      let dateFormatter = ISO8601DateFormatter()
      let jointReplacements = samples.compactMap { sample -> [String: Any]? in
        guard let metadata = sample.metadata else { return nil }
        
        return [
          "id": metadata["id"] as? String ?? sample.uuid.uuidString,
          "type": metadata["type"] as? String ?? "",
          "manufacturer": metadata["manufacturer"] as? String ?? "",
          "model": metadata["model"] as? String ?? "",
          "serialNumber": metadata[HKMetadataKeyMedicalDeviceSerialNumber] as? String ?? "",
          "implantDate": dateFormatter.string(from: sample.startDate),
          "location": metadata["location"] as? String ?? "",
          "surgeon": metadata["surgeon"] as? String ?? "",
          "hospital": metadata["hospital"] as? String ?? "",
          "notes": metadata["notes"] as? String ?? ""
        ]
      }
      
      resolve(jointReplacements)
    }
    
    healthStore.execute(query)
  }
  
  @objc(deleteJointReplacement:resolver:rejecter:)
  func deleteJointReplacement(_ id: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available on this device
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("error", "HealthKit is not available on this device", nil)
      return
    }
    
    // Create a predicate to find the joint replacement with the given ID
    let predicate = HKQuery.predicateForObjects(withMetadataKey: "id", allowedValues: [id])
    
    // Create the query
    let query = HKSampleQuery(sampleType: jointReplacementType, predicate: predicate, limit: 1, sortDescriptors: nil) { (query, samples, error) in
      if let error = error {
        reject("error", "Failed to find joint replacement: \(error.localizedDescription)", error)
        return
      }
      
      guard let sample = samples?.first else {
        resolve(false)
        return
      }
      
      // Delete the joint replacement
      self.healthStore.delete([sample]) { (success, error) in
        if let error = error {
          reject("error", "Failed to delete joint replacement: \(error.localizedDescription)", error)
          return
        }
        resolve(success)
      }
    }
    
    healthStore.execute(query)
  }
}
