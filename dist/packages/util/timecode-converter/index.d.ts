import secondsToTimecode from './src/secondsToTimecode';
/**
 * @param {*} time
 * Can take as input timecodes in the following formats
 * - hh:mm:ss:ff
 * - mm:ss
 * - m:ss
 * - ss - seconds --> if it's already in seconds then it just returns seconds
 * - hh:mm:ff
 * @todo could be refactored with some helper functions for clarity
 */
export function timecodeToSeconds(time: any): number;
export function shortTimecode(time: any): string;
export { secondsToTimecode };
//# sourceMappingURL=index.d.ts.map