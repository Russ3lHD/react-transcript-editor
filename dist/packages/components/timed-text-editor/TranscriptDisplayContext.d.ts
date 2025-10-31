/**
 * Context for transcript display preferences
 * Used to avoid expensive forceRenderDecorator() calls
 * and allow WrapperBlock components to subscribe to preference changes directly
 */
export const TranscriptDisplayContext: import("react").Context<{
    showSpeakers: boolean;
    showTimecodes: boolean;
    timecodeOffset: number;
    isEditable: boolean;
}>;
export default TranscriptDisplayContext;
//# sourceMappingURL=TranscriptDisplayContext.d.ts.map