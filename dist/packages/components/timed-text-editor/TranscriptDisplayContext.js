import { createContext } from 'react';
/**
 * Context for transcript display preferences
 * Used to avoid expensive forceRenderDecorator() calls
 * and allow WrapperBlock components to subscribe to preference changes directly
 */
export const TranscriptDisplayContext = createContext({
    showSpeakers: true,
    showTimecodes: true,
    timecodeOffset: 0,
    isEditable: true
});
export default TranscriptDisplayContext;
//# sourceMappingURL=TranscriptDisplayContext.js.map