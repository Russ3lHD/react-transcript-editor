/**
 * Unit tests for DeviceCapabilityDetector
 * Phase 7: Dynamic Chunk Sizing Implementation
 */

import DeviceCapabilityDetector, { 
  getDeviceCapabilityDetector, 
  DEVICE_TIERS 
} from './DeviceCapabilityDetector.js';

describe('DeviceCapabilityDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new DeviceCapabilityDetector();
    detector.clearCache();
  });

  describe('CPU Detection', () => {
    it('should detect CPU cores from navigator.hardwareConcurrency', () => {
      const mockCores = 8;
      global.navigator = { hardwareConcurrency: mockCores };
      
      const cores = detector.getCPUCores();
      expect(cores).toBe(mockCores);
    });

    it('should fallback to 4 cores when API not available', () => {
      global.navigator = {};
      
      const cores = detector.getCPUCores();
      expect(cores).toBe(4);
    });

    it('should handle navigator being undefined', () => {
      global.navigator = undefined;
      
      const cores = detector.getCPUCores();
      expect(cores).toBe(4);
    });
  });

  describe('Memory Detection', () => {
    it('should detect device memory from navigator.deviceMemory', () => {
      const mockMemory = 8;
      global.navigator = { deviceMemory: mockMemory };
      
      const memory = detector.getDeviceMemory();
      expect(memory).toBe(mockMemory);
    });

    it('should fallback to 4 GB when API not available', () => {
      global.navigator = {};
      
      const memory = detector.getDeviceMemory();
      expect(memory).toBe(4);
    });
  });

  describe('Network Detection', () => {
    it('should detect 4g connection', () => {
      global.navigator = {
        connection: { effectiveType: '4g' }
      };
      
      const connection = detector.getConnectionSpeed();
      expect(connection).toBe('4g');
    });

    it('should detect 3g connection', () => {
      global.navigator = {
        connection: { effectiveType: '3g' }
      };
      
      const connection = detector.getConnectionSpeed();
      expect(connection).toBe('3g');
    });

    it('should fallback to 4g when API not available', () => {
      global.navigator = {};
      
      const connection = detector.getConnectionSpeed();
      expect(connection).toBe('4g');
    });
  });

  describe('CPU Scoring', () => {
    it('should score 1-2 cores as low-end (0-40)', () => {
      expect(detector.calculateCPUScore(1)).toBe(20);
      expect(detector.calculateCPUScore(2)).toBe(40);
    });

    it('should score 3-4 cores as mid-range (40-60)', () => {
      expect(detector.calculateCPUScore(3)).toBe(50);
      expect(detector.calculateCPUScore(4)).toBe(60);
    });

    it('should score 5-8 cores as good (60-80)', () => {
      expect(detector.calculateCPUScore(5)).toBe(65);
      expect(detector.calculateCPUScore(8)).toBe(80);
    });

    it('should score 9+ cores as high-end (80-100)', () => {
      expect(detector.calculateCPUScore(9)).toBe(82);
      expect(detector.calculateCPUScore(16)).toBe(94);
      expect(detector.calculateCPUScore(32)).toBe(100); // Capped at 100
    });
  });

  describe('Memory Scoring', () => {
    it('should score < 2 GB as low-end (0-30)', () => {
      expect(detector.calculateMemoryScore(1)).toBe(15);
      expect(detector.calculateMemoryScore(2)).toBe(30);
    });

    it('should score 2-4 GB as mid-range (30-60)', () => {
      expect(detector.calculateMemoryScore(2)).toBe(30);
      expect(detector.calculateMemoryScore(4)).toBe(60);
    });

    it('should score 4-8 GB as good (60-80)', () => {
      expect(detector.calculateMemoryScore(4)).toBe(60);
      expect(detector.calculateMemoryScore(8)).toBe(80);
    });

    it('should score 8+ GB as high-end (80-100)', () => {
      expect(detector.calculateMemoryScore(8)).toBe(80);
      expect(detector.calculateMemoryScore(16)).toBe(100);
      expect(detector.calculateMemoryScore(32)).toBe(100); // Capped at 100
    });
  });

  describe('Network Scoring', () => {
    it('should score different connection types correctly', () => {
      expect(detector.calculateNetworkScore('slow-2g')).toBe(10);
      expect(detector.calculateNetworkScore('2g')).toBe(30);
      expect(detector.calculateNetworkScore('3g')).toBe(60);
      expect(detector.calculateNetworkScore('4g')).toBe(100);
      expect(detector.calculateNetworkScore('unknown')).toBe(70);
    });
  });

  describe('Overall Score Calculation', () => {
    it('should calculate weighted score correctly', () => {
      // High-end device: 16 cores, 16 GB, 4g
      // CPU: 94 * 0.4 = 37.6
      // Memory: 100 * 0.4 = 40
      // Network: 100 * 0.2 = 20
      // Total: 97.6 = 98 (rounded)
      const score = detector.calculateScore(16, 16, '4g');
      expect(score).toBe(98);
    });

    it('should calculate mid-range score correctly', () => {
      // Mid-range device: 4 cores, 4 GB, 4g
      // CPU: 60 * 0.4 = 24
      // Memory: 60 * 0.4 = 24
      // Network: 100 * 0.2 = 20
      // Total: 68
      const score = detector.calculateScore(4, 4, '4g');
      expect(score).toBe(68);
    });

    it('should calculate low-end score correctly', () => {
      // Low-end device: 2 cores, 2 GB, 3g
      // CPU: 40 * 0.4 = 16
      // Memory: 30 * 0.4 = 12
      // Network: 60 * 0.2 = 12
      // Total: 40
      const score = detector.calculateScore(2, 2, '3g');
      expect(score).toBe(40);
    });
  });

  describe('Tier Detection', () => {
    it('should detect HIGH_END tier (score >= 80)', () => {
      const tier = detector.getTierFromScore(98);
      expect(tier.name).toBe('HIGH_END');
      expect(tier.chunkSize).toBe(100);
      expect(tier.threshold).toBe(100);
    });

    it('should detect MID_RANGE tier (score >= 40 and < 80)', () => {
      const tier = detector.getTierFromScore(68);
      expect(tier.name).toBe('MID_RANGE');
      expect(tier.chunkSize).toBe(50);
      expect(tier.threshold).toBe(100);
    });

    it('should detect LOW_END tier (score < 40)', () => {
      const tier = detector.getTierFromScore(35);
      expect(tier.name).toBe('LOW_END');
      expect(tier.chunkSize).toBe(25);
      expect(tier.threshold).toBe(75);
    });
  });

  describe('Full Detection Flow', () => {
    it('should detect high-end device correctly', () => {
      global.navigator = {
        hardwareConcurrency: 16,
        deviceMemory: 16,
        connection: { effectiveType: '4g' }
      };

      const tier = detector.detectDeviceTier();
      
      expect(tier.name).toBe('HIGH_END');
      expect(tier.chunkSize).toBe(100);
      expect(tier.capabilities.cores).toBe(16);
      expect(tier.capabilities.memoryGB).toBe(16);
    });

    it('should detect mid-range device correctly', () => {
      global.navigator = {
        hardwareConcurrency: 4,
        deviceMemory: 8,
        connection: { effectiveType: '4g' }
      };

      const tier = detector.detectDeviceTier();
      
      expect(tier.name).toBe('MID_RANGE');
      expect(tier.chunkSize).toBe(50);
    });

    it('should detect low-end device correctly', () => {
      global.navigator = {
        hardwareConcurrency: 2,
        deviceMemory: 2,
        connection: { effectiveType: '3g' }
      };

      const tier = detector.detectDeviceTier();
      
      expect(tier.name).toBe('LOW_END');
      expect(tier.chunkSize).toBe(25);
      expect(tier.threshold).toBe(75);
    });
  });

  describe('Caching', () => {
    it('should cache detection result', () => {
      global.navigator = {
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { effectiveType: '4g' }
      };

      const tier1 = detector.detectDeviceTier();
      
      // Change navigator (should still return cached result)
      global.navigator.hardwareConcurrency = 2;
      const tier2 = detector.detectDeviceTier();
      
      expect(tier1).toBe(tier2);
      expect(tier2.capabilities.cores).toBe(8); // Original value
    });

    it('should clear cache when requested', () => {
      global.navigator = {
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { effectiveType: '4g' }
      };

      detector.detectDeviceTier();
      expect(detector.cachedTier).toBeTruthy();
      
      detector.clearCache();
      expect(detector.cachedTier).toBeNull();
    });
  });

  describe('Tier Override', () => {
    it('should allow tier override for testing', () => {
      detector.setTierOverride('LOW_END');
      
      const tier = detector.getTier();
      expect(tier.name).toBe('LOW_END');
      expect(tier.overridden).toBe(true);
    });

    it('should handle invalid tier override', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      detector.setTierOverride('INVALID_TIER');
      
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = getDeviceCapabilityDetector();
      const instance2 = getDeviceCapabilityDetector();
      
      expect(instance1).toBe(instance2);
    });

    it('should share cached tier across instances', () => {
      global.navigator = {
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { effectiveType: '4g' }
      };

      const instance1 = getDeviceCapabilityDetector();
      const tier1 = instance1.detectDeviceTier();
      
      const instance2 = getDeviceCapabilityDetector();
      const tier2 = instance2.getTier();
      
      expect(tier1).toBe(tier2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very low memory (0.5 GB)', () => {
      const score = detector.calculateMemoryScore(0.5);
      expect(score).toBeLessThanOrEqual(30);
    });

    it('should handle very high core count (64 cores)', () => {
      const score = detector.calculateCPUScore(64);
      expect(score).toBe(100);
    });

    it('should handle missing connection object', () => {
      global.navigator = { connection: null };
      
      const connection = detector.getConnectionSpeed();
      expect(connection).toBe('4g'); // Fallback
    });

    it('should handle partial navigator support', () => {
      global.navigator = {
        hardwareConcurrency: 8
        // deviceMemory and connection missing
      };

      const tier = detector.detectDeviceTier();
      
      expect(tier).toBeTruthy();
      expect(tier.capabilities.cores).toBe(8);
      expect(tier.capabilities.memoryGB).toBe(4); // Fallback
      expect(tier.capabilities.connectionType).toBe('4g'); // Fallback
    });
  });

  describe('DEVICE_TIERS Export', () => {
    it('should export device tiers correctly', () => {
      expect(DEVICE_TIERS.HIGH_END.chunkSize).toBe(100);
      expect(DEVICE_TIERS.MID_RANGE.chunkSize).toBe(50);
      expect(DEVICE_TIERS.LOW_END.chunkSize).toBe(25);
    });

    it('should have correct thresholds', () => {
      expect(DEVICE_TIERS.HIGH_END.threshold).toBe(100);
      expect(DEVICE_TIERS.MID_RANGE.threshold).toBe(100);
      expect(DEVICE_TIERS.LOW_END.threshold).toBe(75);
    });
  });
});
