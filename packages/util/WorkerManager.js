/* eslint-disable no-console */
/**
 * WorkerManager - Handles Web Worker instantiation, messaging, and cleanup
 *
 * Features:
 * - Promise-based API for async worker communication
 * - Fallback to synchronous processing if workers not available
 * - Progress callback support
 * - Error handling and propagation
 */

// Import the regular (non-worker) adapter as fallback
import sttJsonAdapter from '../stt-adapters/index.js';

class WorkerManager {
  constructor() {
    this.worker = null;
    this.pendingRequests = new Map();
    this.messageId = 0;
    this.workerSupported = typeof Worker !== 'undefined';
    this.useWorker = this.workerSupported;
  }

  /**
   * Initialize the worker
   */
  async init() {
    if (!this.workerSupported || !this.useWorker) {
      console.log('Web Workers not available or disabled, using synchronous processing');
      return;
    }

    if (this.worker) {
      return; // Already initialized
    }

    try {
      // Dynamically import worker
      const { default: Worker } = await import(/* webpackChunkName: "stt-worker" */ '../workers/stt-converter.worker.js?worker');
      this.worker = new Worker();
      this.setupWorkerHandlers();
    } catch (error) {
      console.warn('Failed to initialize Web Worker, falling back to sync processing:', error);
      this.useWorker = false;
      this.worker = null;
    }
  }

  /**
   * Setup worker event handlers
   */
  setupWorkerHandlers() {
    if (!this.worker) return;

    this.worker.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.handleError({
        message: error.message
      });
    };
  }

  /**
   * Handle messages from worker
   */
  handleMessage(message) {
    const { id, type, data, error } = message;

    if (type === 'ready') {
      console.log('STT Converter Worker is ready');
      return;
    }

    const request = this.pendingRequests.get(id);
    if (!request) {
      return;
    }

    switch (type) {
      case 'progress':
        if (request.onProgress) {
          request.onProgress(data);
        }
        break;

      case 'complete':
        request.resolve(data);
        this.pendingRequests.delete(id);
        break;

      case 'error':
        request.reject(new Error(error.message));
        this.pendingRequests.delete(id);
        break;
    }
  }

  /**
   * Handle worker errors
   */
  handleError(error) {
    this.pendingRequests.forEach((request) => {
      request.reject(new Error(`Worker error: ${error.message}`));
    });
    this.pendingRequests.clear();
  }

  /**
   * Convert STT JSON to DraftJS format
   * Uses worker if available, falls back to synchronous processing
   *
   * @param {Object} transcriptData - STT JSON data
   * @param {string} sttJsonType - Format type ('whisper', 'bbckaldi', etc.)
   * @param {Function} onProgress - Progress callback (optional)
   * @returns {Promise<Object>} - DraftJS format { blocks, entityMap }
   */
  async convertTranscript(transcriptData, sttJsonType, onProgress) {
    // Try to use worker if available
    if (this.useWorker) {
      try {
        await this.init();

        if (this.worker) {
          return this.convertWithWorker(transcriptData, sttJsonType, onProgress);
        }
      } catch (error) {
        console.warn('Worker processing failed, falling back to sync:', error);
      }
    }

    // Fallback: synchronous processing
    return this.convertSync(transcriptData, sttJsonType, onProgress);
  }

  /**
   * Convert using Web Worker (async, non-blocking)
   */
  convertWithWorker(transcriptData, sttJsonType, onProgress) {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;

      this.pendingRequests.set(id, {
        resolve,
        reject,
        onProgress
      });

      this.worker.postMessage({
        id,
        type: 'convert',
        data: {
          transcriptData,
          sttJsonType
        }
      });
    });
  }

  /**
   * Convert synchronously (blocking, fallback)
   */
  convertSync(transcriptData, sttJsonType, onProgress) {
    return new Promise((resolve) => {
      // Use setTimeout to allow UI to update before heavy processing
      setTimeout(() => {
        if (onProgress) {
          onProgress({ type: 'progress', current: 0, total: 100, percentage: 0 });
        }

        const result = sttJsonAdapter(transcriptData, sttJsonType);

        if (onProgress) {
          onProgress({ type: 'progress', current: 100, total: 100, percentage: 100 });
        }

        resolve(result);
      }, 0);
    });
  }

  /**
   * Terminate the worker and cleanup
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.pendingRequests.forEach((request) => {
      request.reject(new Error('Worker terminated'));
    });
    this.pendingRequests.clear();
  }

  /**
   * Check if Web Workers are supported
   */
  static isSupported() {
    return typeof Worker !== 'undefined';
  }
}

// Singleton instance for shared use
let sharedInstance = null;

/**
 * Get or create shared WorkerManager instance
 */
export const getWorkerManager = () => {
  if (!sharedInstance) {
    sharedInstance = new WorkerManager();
  }
  return sharedInstance;
};

/**
 * Cleanup shared worker instance
 */
export const terminateWorkerManager = () => {
  if (sharedInstance) {
    sharedInstance.terminate();
    sharedInstance = null;
  }
};

export default WorkerManager;
