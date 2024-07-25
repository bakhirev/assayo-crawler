import React from 'react';

import style from './index.module.scss';

interface ProgressBarProps {
  percent?: number | null;
  className?: string;
}

function ProgressBar({
  percent,
  className,
}: ProgressBarProps): React.ReactElement | null {
  const hasPercent = typeof percent === 'number' && percent > 0;
  const width = hasPercent ? `${percent}%` : '0';

  return (
    <div className={`${style.progress_bar} ${className || ''}`}>
      <div
        className={style.progress_bar_value}
        style={{ width }}
        title={width}
      />
    </div>
  );
}

export default ProgressBar;
