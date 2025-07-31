import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import style from './index.module.css';

export interface ExportOption {
  value: string;
  label: string;
}

export interface ExportOptionsProps {
  exportOptionsList: ExportOption[];
  handleExportOptionsChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleExportToggle: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  exportOptionsList,
  handleExportOptionsChange,
  handleExportToggle,
}) => {
  return (
    <div className={style.settings}>
      <h2 className={style.header}>Export Options</h2>
      <div className={style.closeButton} onClick={handleExportToggle}>
        <FontAwesomeIcon icon={faWindowClose} />
      </div>

      <div className={style.controlsContainer}>
        {exportOptionsList.map((opt, index) => (
          <React.Fragment key={`${opt.label}-${index}`}>
            <button
              title={opt.label}
              className={style.playerButton}
              onClick={handleExportOptionsChange}
              value={opt.value}
            >
              {opt.label}
            </button>
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ExportOptions; 