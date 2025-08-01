import type { BlockData, ExportFormat, ExportResult } from './types';
/**
 * Adapters for Draft.js conversion
 * @param blockData - Draft.js blocks
 * @param exportFormat - the type of file supported by the available adapters
 * @param transcriptTitle - optional title for the transcript
 * @returns Export result with data and file extension
 */
declare const exportAdapter: (blockData: BlockData, exportFormat: ExportFormat, transcriptTitle?: string) => ExportResult | null;
export default exportAdapter;
//# sourceMappingURL=exportAdapter.d.ts.map