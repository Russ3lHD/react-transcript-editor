/**
 * DeviceCapabilityDetector - Detects device performance tier for optimal loading
 *
 * Phase 7: Dynamic Chunk Sizing Implementation
 *
 * Detects device capabilities (CPU cores, RAM, network speed) and categorizes
 * devices into performance tiers to optimize progressive loading chunk sizes.
 *
 * Features:
 * - Detects CPU cores via navigator.hardwareConcurrency
 * - Detects RAM via navigator.deviceMemory
 * - Detects network speed via navigator.connection
 * - Graceful fallback for unsupported browsers
 * - Singleton pattern for performance
 *
 * @module DeviceCapabilityDetector
 */

/* eslint-disable no-console */

/**
 * Device performance tiers with corresponding chunk sizes
 */
const DEVICE_TIERS = {
  HIGH_END: {
    name: 'HIGH_END',
    chunkSize: 100,
    threshold: 100, // Start progressive loading at 100+ blocks
    description: 'High Performance',
    minScore: 80
  },
  MID_RANGE: {
    name: 'MID_RANGE',
    chunkSize: 50,
    threshold: 100,
    description: 'Optimized',
    minScore: 40
  },
  LOW_END: {
    name: 'LOW_END',
    chunkSize: 25,
    threshold: 75, // Start progressive loading earlier
    description: 'Memory Saver',
    minScore: 0
  }
};

/**
 * Scoring weights for device capability factors
 */
const SCORING_WEIGHTS = {
  CPU: 0.4,      // 40% weight
  MEMORY: 0.4,   // 40% weight
  NETWORK: 0.2   // 20% weight
};

class DeviceCapabilityDetector {
  constructor() {
    this.cachedTier = null;
    this.capabilities = null;
  }

  /**
   * Get CPU core count
   * @returns {number} Number of logical CPU cores (1-16+)
   */
  getCPUCores() {
    try {
      if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency;
      }
    } catch (e) {
      console.warn('Failed to detect CPU cores:', e);
    }

    // Fallback: assume mid-range device (4 cores)
    return 4;
  }

  /**
   * Get device memory in GB
   * @returns {number} RAM in gigabytes (0.25 - 32+)
   */
  getDeviceMemory() {
    try {
      if (typeof navigator !== 'undefined' && navigator.deviceMemory) {
        return navigator.deviceMemory;
      }
    } catch (e) {
      console.warn('Failed to detect device memory:', e);
    }

    // Fallback: assume mid-range device (4 GB)
    return 4;
  }

  /**
   * Get network connection speed
   * @returns {string} Connection type: '4g', '3g', '2g', 'slow-2g', or 'unknown'
   */
  getConnectionSpeed() {
    try {
      if (typeof navigator !== 'undefined' &&
          navigator.connection &&
          navigator.connection.effectiveType) {
        return navigator.connection.effectiveType;
      }
    } catch (e) {
      console.warn('Failed to detect connection speed:', e);
    }

    // Fallback: assume decent connection
    return '4g';
  }

  /**
   * Calculate CPU score (0-100)
   * @param {number} cores - Number of CPU cores
   * @returns {number} Score from 0 to 100
   */
  calculateCPUScore(cores) {
    // Scoring:
    // 1-2 cores: Low-end (0-40)
    // 3-4 cores: Mid-range (40-60)
    // 5-8 cores: Good (60-80)
    // 9+ cores: High-end (80-100)

    if (cores <= 2) return Math.min(cores * 20, 40);
    if (cores <= 4) return 40 + ((cores - 2) * 10);
    if (cores <= 8) return 60 + ((cores - 4) * 5);
    return Math.min(80 + ((cores - 8) * 2), 100);
  }

  /**
   * Calculate memory score (0-100)
   * @param {number} memoryGB - RAM in gigabytes
   * @returns {number} Score from 0 to 100
   */
  calculateMemoryScore(memoryGB) {
    // Scoring:
    // < 2 GB: Low-end (0-30)
    // 2-4 GB: Mid-range (30-60)
    // 4-8 GB: Good (60-80)
    // 8+ GB: High-end (80-100)

    if (memoryGB < 2) return Math.min(memoryGB * 15, 30);
    if (memoryGB < 4) return 30 + ((memoryGB - 2) * 15);
    if (memoryGB < 8) return 60 + ((memoryGB - 4) * 5);
    return Math.min(80 + ((memoryGB - 8) * 2.5), 100);
  }

  /**
   * Calculate network score (0-100)
   * @param {string} connectionType - Connection type
   * @returns {number} Score from 0 to 100
   */
  calculateNetworkScore(connectionType) {
    const scores = {
      'slow-2g': 10,
      '2g': 30,
      '3g': 60,
      '4g': 100,
      'unknown': 70 // Assume decent connection
    };

    return scores[connectionType] || 70;
  }

  /**
   * Calculate overall device score
   * @param {number} cores - CPU cores
   * @param {number} memoryGB - RAM in GB
   * @param {string} connectionType - Network connection type
   * @returns {number} Overall score from 0 to 100
   */
  calculateScore(cores, memoryGB, connectionType) {
    const cpuScore = this.calculateCPUScore(cores);
    const memoryScore = this.calculateMemoryScore(memoryGB);
    const networkScore = this.calculateNetworkScore(connectionType);

    const totalScore =
      (cpuScore * SCORING_WEIGHTS.CPU) +
      (memoryScore * SCORING_WEIGHTS.MEMORY) +
      (networkScore * SCORING_WEIGHTS.NETWORK);

    return Math.round(totalScore);
  }

  /**
   * Determine device tier based on score
   * @param {number} score - Overall device score
   * @returns {Object} Device tier configuration
   */
  getTierFromScore(score) {
    if (score >= DEVICE_TIERS.HIGH_END.minScore) {
      return DEVICE_TIERS.HIGH_END;
    }
    if (score >= DEVICE_TIERS.MID_RANGE.minScore) {
      return DEVICE_TIERS.MID_RANGE;
    }
    return DEVICE_TIERS.LOW_END;
  }

  /**
   * Detect device performance tier
   * @returns {Object} Device tier with chunkSize, threshold, and description
   */
  detectDeviceTier() {
    // Return cached result if available
    if (this.cachedTier) {
      return this.cachedTier;
    }

    // Gather device capabilities
    const cores = this.getCPUCores();
    const memoryGB = this.getDeviceMemory();
    const connectionType = this.getConnectionSpeed();

    // Store raw capabilities for debugging
    this.capabilities = {
      cores,
      memoryGB,
      connectionType
    };

    // Calculate score and determine tier
    const score = this.calculateScore(cores, memoryGB, connectionType);
    const tier = this.getTierFromScore(score);

    // Cache the result with additional metadata
    this.cachedTier = {
      ...tier,
      score,
      capabilities: this.capabilities
    };

    // Log detection result for debugging
    console.log(`📊 Device Performance Tier: ${tier.name}`, {
      score,
      cores,
      memoryGB,
      connectionType,
      chunkSize: tier.chunkSize,
      threshold: tier.threshold
    });

    return this.cachedTier;
  }

  /**
   * Get current device tier (detects if not already cached)
   * @returns {Object} Device tier configuration
   */
  getTier() {
    return this.detectDeviceTier();
  }

  /**
   * Clear cached tier (useful for testing or forced re-detection)
   */
  clearCache() {
    this.cachedTier = null;
    this.capabilities = null;
  }

  /**
   * Override device tier for testing purposes
   * @param {string} tierName - 'HIGH_END', 'MID_RANGE', or 'LOW_END'
   */
  setTierOverride(tierName) {
    if (DEVICE_TIERS[tierName]) {
      this.cachedTier = { ...DEVICE_TIERS[tierName], overridden: true };
      console.warn(`⚠️ Device tier overridden to: ${tierName}`);
    } else {
      console.error(`Invalid tier name: ${tierName}`);
    }
  }
}

/**
 * Singleton instance
 */
let instance = null;

/**
 * Get singleton instance of DeviceCapabilityDetector
 * @returns {DeviceCapabilityDetector} Singleton instance
 */
export function getDeviceCapabilityDetector() {
  if (!instance) {
    instance = new DeviceCapabilityDetector();
  }
  return instance;
}

/**
 * Export device tiers for testing/reference
 */
export { DEVICE_TIERS };

/**
 * Export class for direct instantiation if needed
 */
export default DeviceCapabilityDetector;
