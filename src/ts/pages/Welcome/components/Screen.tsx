import React from 'react';

import style from '../styles/screen.module.scss';

interface ScreenProps {
  children: React.ReactNode;
}

function Screen({ children }: ScreenProps) {
  return (
    <div className={style.welcome_screen_wrapper}>
      <div className={style.welcome_screen}>
        {children}
      </div>
    </div>
  );
}

export default Screen;
