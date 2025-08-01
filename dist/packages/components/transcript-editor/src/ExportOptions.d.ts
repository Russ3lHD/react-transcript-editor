import React from 'react';
export interface ExportOption {
    value: string;
    label: string;
}
export interface ExportOptionsProps {
    exportOptionsList: ExportOption[];
    handleExportOptionsChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleExportToggle: () => void;
}
declare const ExportOptions: React.FC<ExportOptionsProps>;
export default ExportOptions;
//# sourceMappingURL=ExportOptions.d.ts.map