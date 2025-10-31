# Integration Prompt for Loading Performance Optimizations

Copy and paste this prompt to an AI assistant (like GitHub Copilot, ChatGPT, or Claude) to guide implementation of the optimization strategies.

---

## 📋 Context Prompt

```
I'm working on a React transcript editor application that displays and allows editing of 
time-synced transcripts. The application uses DraftJS for text editing and displays 
transcripts as blocks (paragraphs) with timing information for each word.

Current implementation already has:
✅ Progressive loading (Phase 3) - loads large transcripts in 50-block chunks
✅ Binary search for word lookup - O(log n) instead of O(n)
✅ CSS-based highlighting - static classes instead of dynamic style injection
✅ Memoized Word components - React.memo with custom comparison

The codebase structure:
- packages/components/timed-text-editor/index.js - Main editor component (1038 lines)
- packages/components/timed-text-editor/Word.js - Word component with memoization
- packages/components/timed-text-editor/CustomEditor.js - DraftJS editor wrapper
- packages/stt-adapters/ - Converts various STT formats to DraftJS
- packages/export-adapters/ - Exports to various formats

Current performance for 200-block transcript:
- Initial load: 400-600ms (80% better than baseline of 2000-3000ms)
- Time to interactive: 800-1200ms
- Memory usage: ~120MB
- Scroll FPS: 55-60

I need to implement the next phase of optimizations following the detailed guides in:
- PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md
- LOADING_PERFORMANCE_OPTIMIZATION_GUIDE.md
- QUICK_REFERENCE_LOADING_OPTIMIZATION.md
```

---

## 🎯 Phase 4: Virtual Scrolling Integration

```
TASK: Implement virtual scrolling for the transcript editor

REQUIREMENTS:
1. Install react-window and react-virtualized-auto-sizer
2. Create a new VirtualizedEditor component that:
   - Renders only visible blocks plus buffer (overscanCount: 5)
   - Uses VariableSizeList for variable-height blocks
   - Measures and caches block heights dynamically
   - Maintains all existing editor functionality (editing, word highlighting, playback sync)
3. Integrate with TimedTextEditor component:
   - Enable virtual scrolling for transcripts with 100+ blocks
   - Keep standard CustomEditor for smaller transcripts (< 100 blocks)
   - Ensure seamless switching between modes
4. Preserve existing features:
   - Word-level playback synchronization
   - Click-to-seek functionality
   - Scroll-into-view for current word
   - Speaker labels and timecodes
   - Text editing capabilities

EXPECTED OUTCOME:
- Reduce rendered DOM nodes by 90% (200 blocks → 15-20 visible)
- Improve scroll performance to consistent 60 FPS
- Reduce memory usage by 60%
- No loss of existing functionality

FILES TO MODIFY:
- CREATE: packages/components/timed-text-editor/VirtualizedEditor.js
- MODIFY: packages/components/timed-text-editor/index.js
- MODIFY: packages/components/timed-text-editor/WrapperBlock.js (if needed for height measurement)

REFERENCE:
See PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md section "Strategy 1: Virtual Scrolling" 
for complete implementation code and integration examples.

TESTING REQUIREMENTS:
- Test with small transcripts (< 100 blocks) - should use standard editor
- Test with medium transcripts (200 blocks) - should use virtual scrolling
- Test with large transcripts (500+ blocks) - should maintain performance
- Verify word highlighting still works during playback
- Verify scroll-into-view works with virtualization
- Verify editing functionality preserved
```

---

## 🔧 Phase 5: Web Worker Integration

```
TASK: Implement Web Worker for transcript processing

REQUIREMENTS:
1. Create a Web Worker that:
   - Processes STT JSON to DraftJS format (sttJsonAdapter)
   - Extracts word timings for binary search
   - Handles errors gracefully with fallback to main thread
2. Create a worker manager/hook:
   - Manages worker lifecycle (initialization, termination)
   - Handles message passing with promises
   - Supports multiple concurrent requests
3. Update loadData() method:
   - Check for Web Worker support
   - Process transcript in worker (non-blocking)
   - Fall back to main thread if workers not available
   - Maintain existing progressive loading logic
4. Add proper cleanup:
   - Terminate worker on component unmount
   - Cancel pending operations when needed

EXPECTED OUTCOME:
- Main thread remains responsive during processing
- 50-70% faster perceived load time
- Eliminate UI freezing on large transcripts
- Better experience on lower-end devices

FILES TO CREATE:
- packages/workers/transcript-processor.worker.js
- packages/hooks/useTranscriptWorker.js (optional, for cleaner API)

FILES TO MODIFY:
- packages/components/timed-text-editor/index.js (loadData method)
- webpack.config.js (add worker support if needed)

REFERENCE:
See PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md section "Strategy 2: Web Workers" 
for complete worker implementation and integration code.

IMPORTANT CONSIDERATIONS:
- Web Workers cannot access DOM
- Data must be serializable (no functions, DOM nodes)
- sttJsonAdapter imports may need bundler configuration
- Provide fallback for browsers without worker support
```

---

## 💾 Phase 6: IndexedDB Caching Integration

```
TASK: Implement IndexedDB caching for processed transcripts

REQUIREMENTS:
1. Create TranscriptCache class:
   - Initialize IndexedDB database on first use
   - Generate cache keys from transcript data hash + STT type
   - Store/retrieve processed DraftJS blocks
   - Implement cache cleanup (delete entries older than 7 days)
2. Integrate with loadData():
   - Check cache before processing
   - Use cached data if available (instant load)
   - Process and cache on cache miss
   - Handle errors gracefully (continue without cache)
3. Add cache management:
   - Clean up old entries on component mount
   - Provide method to clear cache manually
   - Handle storage quota exceeded errors

EXPECTED OUTCOME:
- Instant loading for previously processed transcripts
- 95%+ faster load time for cached data
- Reduced server load (fewer re-downloads)
- Better offline experience

FILES TO CREATE:
- packages/util/transcript-cache.js

FILES TO MODIFY:
- packages/components/timed-text-editor/index.js (loadData method)

REFERENCE:
See PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md section "Strategy 3: IndexedDB Caching"
for complete cache implementation.

IMPORTANT CONSIDERATIONS:
- IndexedDB operations are asynchronous
- Handle quota exceeded errors
- Cache keys must be consistent for same data
- Consider adding cache version for breaking changes
```

---

## ⚡ Phase 7: Dynamic Chunk Sizing Integration

```
TASK: Implement device-aware dynamic chunk sizing

REQUIREMENTS:
1. Create PerformanceDetector utility:
   - Detect device memory (navigator.deviceMemory)
   - Detect CPU cores (navigator.hardwareConcurrency)
   - Detect network type (navigator.connection.effectiveType)
   - Calculate optimal chunk size based on capabilities
2. Integrate with progressive loading:
   - Replace fixed CHUNK_SIZE with dynamic value
   - Adjust based on device class (high-end, mid-range, low-end)
   - Consider network conditions
3. Device classification:
   - High-end: 8GB+ RAM, 4+ cores → 100 blocks per chunk
   - Mid-range: 4GB+ RAM, 2+ cores → 50 blocks per chunk
   - Low-end: < 4GB RAM or < 2 cores → 25 blocks per chunk
   - Slow connection: Reduce chunk size by 50%

EXPECTED OUTCOME:
- Better performance on low-end devices (smaller chunks)
- Faster loading on high-end devices (larger chunks)
- Adaptive to network conditions

FILES TO CREATE:
- packages/util/performance-detector.js

FILES TO MODIFY:
- packages/components/timed-text-editor/index.js (constructor, loadRemainingChunks)

REFERENCE:
See PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md section "Strategy 4: Dynamic Chunk Sizing"
for complete implementation.

TESTING:
- Test on high-end device (should use 100-block chunks)
- Test on low-end device (should use 25-block chunks)
- Test with throttled network (should reduce chunk size)
```

---

## 🧪 Testing Prompt

```
TASK: Implement comprehensive performance testing

REQUIREMENTS:
1. Create performance monitoring utility:
   - Mark timing points (performance.mark)
   - Measure durations between marks
   - Generate performance reports
   - Track memory usage
2. Add benchmarks for:
   - Small transcripts (50 blocks)
   - Medium transcripts (200 blocks)
   - Large transcripts (500 blocks)
   - Extra large transcripts (1000+ blocks)
3. Measure key metrics:
   - Initial load time (first paint)
   - Time to interactive
   - Memory usage over time
   - Scroll FPS during playback
   - Word lookup latency
4. Compare before/after:
   - Baseline (no optimizations)
   - Phase 3 (current - progressive loading)
   - Phase 4 (+ virtual scrolling)
   - Phase 5 (+ web workers)
   - Phase 6 (+ caching)
   - Phase 7 (+ dynamic chunks)

FILES TO CREATE:
- packages/util/performance-monitor.js
- packages/util/test-transcripts.js (generate test data)

FILES TO MODIFY:
- packages/components/timed-text-editor/index.js (add performance marks)

REFERENCE:
See LOADING_PERFORMANCE_OPTIMIZATION_GUIDE.md section "Testing Strategy"
for testing approach and metrics to track.

SUCCESS CRITERIA:
- 200-block transcript: < 200ms initial load, < 500ms interactive
- 500-block transcript: < 400ms initial load, < 1000ms interactive
- Memory usage: < 50MB for 200 blocks
- Scroll FPS: Consistent 60 FPS during playback
```

---

## 🔍 Integration Checklist

Use this checklist when implementing each phase:

```
BEFORE STARTING:
[ ] Read the relevant section in PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md
[ ] Review existing code in packages/components/timed-text-editor/index.js
[ ] Understand current progressive loading implementation
[ ] Set up performance benchmarks for comparison

DURING IMPLEMENTATION:
[ ] Follow the code examples from the documentation
[ ] Maintain existing functionality (editing, playback, export)
[ ] Add proper error handling and fallbacks
[ ] Write comments explaining optimization techniques
[ ] Test incrementally (don't integrate everything at once)

AFTER IMPLEMENTATION:
[ ] Run performance benchmarks (before vs after)
[ ] Test on multiple browsers (Chrome, Firefox, Safari)
[ ] Test on multiple devices (desktop, mobile, tablet)
[ ] Verify all existing features still work
[ ] Check for memory leaks (Chrome DevTools Memory Profiler)
[ ] Update documentation with actual results

TESTING SCENARIOS:
[ ] Load small transcript (< 100 blocks) - should use fast path
[ ] Load medium transcript (200 blocks) - should use optimization
[ ] Load large transcript (500+ blocks) - should maintain performance
[ ] Edit text while playing - should remain smooth
[ ] Seek to different positions - should highlight correctly
[ ] Export transcript - should work with optimized data
[ ] Reload same transcript - should use cache (if implemented)
[ ] Switch between transcripts - should clean up properly
```

---

## 🎯 Quick Implementation Order

For fastest results, implement in this order:

```
WEEK 1-2: Virtual Scrolling (Highest Impact)
Priority: ⭐⭐⭐⭐⭐
Effort: Medium (2-3 days)
Benefit: 90% fewer DOM nodes, 70-80% faster scrolling

WEEK 3-4: Web Workers (High Impact)
Priority: ⭐⭐⭐⭐
Effort: Medium (2-3 days)  
Benefit: Non-blocking processing, responsive UI

WEEK 5-6: IndexedDB Caching (Medium Impact)
Priority: ⭐⭐⭐
Effort: Low (1-2 days)
Benefit: 95%+ faster for cached transcripts

WEEK 7: Dynamic Chunk Sizing (Low Impact)
Priority: ⭐⭐
Effort: Low (1 day)
Benefit: Better experience across devices
```

---

## 💡 Example Usage

To implement Virtual Scrolling, copy this prompt:

```
Please implement virtual scrolling for the transcript editor as described in Phase 4 
of the INTEGRATION_PROMPT.md file. 

Requirements:
- Use react-window with VariableSizeList
- Enable only for transcripts with 100+ blocks
- Maintain all existing functionality (editing, word highlighting, playback sync)
- Measure and cache block heights dynamically
- Set overscanCount to 5 for smooth scrolling

Files to create:
- packages/components/timed-text-editor/VirtualizedEditor.js

Files to modify:
- packages/components/timed-text-editor/index.js

Follow the implementation code from PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md 
section "Strategy 1: Virtual Scrolling".

After implementation, test with:
1. Small transcript (< 100 blocks) - should use standard editor
2. Medium transcript (200 blocks) - should use virtual scrolling
3. Verify word highlighting works during playback
4. Verify scroll-into-view works correctly
```

---

## 📚 Reference Documentation

All implementation details, code examples, and best practices are in:

1. **QUICK_REFERENCE_LOADING_OPTIMIZATION.md** - Quick overview and common questions
2. **PROGRESSIVE_LOADING_IMPLEMENTATION_SUMMARY.md** - Detailed implementation guides
3. **LOADING_PERFORMANCE_OPTIMIZATION_GUIDE.md** - Advanced strategies and testing
4. **PERFORMANCE_IMPROVEMENT_PLAN.md** - Overall performance plan and completed work

---

## 🤝 Getting Help

If you encounter issues during integration:

1. Check the troubleshooting sections in the documentation
2. Verify existing progressive loading is working (lines 340-430 in index.js)
3. Review Chrome DevTools Performance tab for bottlenecks
4. Compare your implementation with the code examples in the docs
5. Test incrementally - don't integrate everything at once

---

**Last Updated**: October 31, 2025  
**Status**: Ready for implementation  
**Estimated Timeline**: 7 weeks for complete integration
