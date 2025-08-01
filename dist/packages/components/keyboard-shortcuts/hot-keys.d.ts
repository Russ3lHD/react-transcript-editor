import type { HotKeys, AnalyticsEvent } from './types';
interface HotKeysContext {
    togglePlayMedia?: () => void;
    skipForward?: () => void;
    skipBackward?: () => void;
    decreasePlaybackRate?: () => void;
    increasePlaybackRate?: () => void;
    rollBack?: () => void;
    promptSetCurrentTime?: () => void;
    props: {
        handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
    };
}
declare function returnHotKeys(self: HotKeysContext): HotKeys;
export default returnHotKeys;
//# sourceMappingURL=hot-keys.d.ts.map