/**
 * Hash Utilities for Cache Key Generation
 *
 * Provides fast, deterministic hashing for transcript data to generate
 * cache keys and validate cache freshness.
 *
 * Uses a simple but effective hash algorithm suitable for cache validation.
 * Not cryptographically secure, but sufficient for detecting data changes.
 *
 * @module hashUtils
 */

/* eslint-disable no-console */

/**
 * Generate a fast hash from a string
 * Uses FNV-1a algorithm - fast and good distribution
 *
 * @param {string} str - String to hash
 * @returns {string} Hex hash string
 */
function simpleHash(str) {
  let hash = 2166136261; // FNV offset basis

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  // Convert to unsigned 32-bit integer and then to hex
  return (hash >>> 0).toString(16);
}

/**
 * Generate hash from JSON object
 * Serializes object to stable JSON string before hashing
 *
 * @param {Object} obj - Object to hash
 * @returns {string} Hash string
 */
export function hashObject(obj) {
  if (!obj) {
    return 'null';
  }

  try {
    // Stringify with sorted keys for deterministic output
    const jsonStr = JSON.stringify(obj, Object.keys(obj).sort());
    return simpleHash(jsonStr);
  } catch (error) {
    console.error('Hash generation error:', error);
    return `error_${Date.now()}`;
  }
}

/**
 * Generate hash from transcript data
 * Focuses on key fields that would indicate a different transcript
 *
 * @param {Object} transcriptData - Raw transcript data (any STT format)
 * @returns {string} Hash string
 */
export function hashTranscriptData(transcriptData) {
  if (!transcriptData) {
    return 'null';
  }

  try {
    // For DraftJS format
    if (transcriptData.blocks && transcriptData.entityMap) {
      // Hash the structure, not the entire content (more efficient)
      const fingerprint = {
        blockCount: transcriptData.blocks.length,
        entityCount: Object.keys(transcriptData.entityMap).length,
        firstBlock: transcriptData.blocks[0]?.text?.substring(0, 100),
        lastBlock: transcriptData.blocks[transcriptData.blocks.length - 1]?.text?.substring(0, 100)
      };
      return hashObject(fingerprint);
    }

    // For Whisper format
    if (transcriptData.segments || transcriptData.words) {
      const fingerprint = {
        segmentCount: transcriptData.segments?.length || 0,
        wordCount: transcriptData.words?.length || 0,
        firstText: transcriptData.segments?.[0]?.text?.substring(0, 100) ||
                   transcriptData.words?.[0]?.word?.substring(0, 100),
        language: transcriptData.language,
        duration: transcriptData.duration
      };
      return hashObject(fingerprint);
    }

    // For BBC Kaldi format
    if (transcriptData.words) {
      const fingerprint = {
        wordCount: transcriptData.words.length,
        firstWord: transcriptData.words[0]?.word,
        lastWord: transcriptData.words[transcriptData.words.length - 1]?.word,
        duration: transcriptData.words[transcriptData.words.length - 1]?.end
      };
      return hashObject(fingerprint);
    }

    // Fallback: hash entire object
    return hashObject(transcriptData);

  } catch (error) {
    console.error('Transcript hash generation error:', error);
    // Use timestamp as fallback to prevent cache collisions
    return `error_${Date.now()}`;
  }
}

/**
 * Generate a combined cache identifier
 * Combines media URL and transcript hash for unique cache key
 *
 * @param {string} mediaUrl - URL or identifier of media file
 * @param {Object} transcriptData - Raw transcript data
 * @returns {string} Cache identifier
 */
export function generateCacheIdentifier(mediaUrl, transcriptData) {
  const dataHash = hashTranscriptData(transcriptData);

  // Handle blob URLs by using just the hash
  if (mediaUrl && mediaUrl.includes('blob:')) {
    return `blob_${dataHash}`;
  }

  // For regular URLs, combine URL hash and data hash
  const urlHash = mediaUrl ? simpleHash(mediaUrl) : 'nourl';
  return `${urlHash}_${dataHash}`;
}

export default {
  hashObject,
  hashTranscriptData,
  generateCacheIdentifier
};
