import React, { useEffect, useState } from 'react';

import style from './index.module.scss';

interface ProgressBarProps {
  percent?: number | null;
  className?: string;
}

function ProgressBar({
  percent,
  className,
}: ProgressBarProps): React.ReactElement | null {
  const [speed, setSpeed] = useState<number>(4);
  const [prevTime, setPrevTime] = useState<number>(0);
  const hasPercent = typeof percent === 'number' && percent > 0;
  const width = hasPercent ? `${percent}%` : '0';

  useEffect(() => {
    const today = (new Date()).getTime();
    let newSpeed = (today - prevTime) * 0.9 / 1000;
    if (newSpeed < 1) newSpeed = 1;
    if (newSpeed > 20) newSpeed = 20;
    if (hasPercent && (percent < 10 || percent > 90)) newSpeed = 2;

    setPrevTime(today);
    setSpeed(newSpeed);
  }, [percent]);

  return (
    <div className={`${style.progress_bar} ${className || ''}`}>
      <div
        className={style.progress_bar_value}
        style={{ width, transition: `width ${speed}s` }}
        title={width}
      />
    </div>
  );
}

export default ProgressBar;
