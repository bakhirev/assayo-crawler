import React from 'react';

import style from '../styles/area.module.scss';

function getText(text?: string) {
  const [before, link, after] = (text || '').split('%');
  return { before, link, after };
}

interface AreaProps {
  icon: string;
  title?: string;
  description?: string;
  link?: string;
  onChange?: Function;
}

function Area({
  icon,
  title,
  description,
  link,
  onChange,
}: AreaProps) {
  const config = getText(title);
  const example = getText(description);

  return (
    <div className={style.welcome_area}>
      <img
        src={icon}
        className={style.welcome_area_icon}
      />
      <p className={style.welcome_area_description}>
        {config.before}
        <label className={style.welcome_area_link}>
          {config.link}
          <input
            multiple
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={async (event: any) => {
              console.log(event);
              console.log(onChange);
            }}
          />
        </label>
        {config.after}
        {' '}
        {example.before}
        <a
          href={link || ''}
          target="_blank"
          className={style.welcome_area_link}
        >
          {example.link}
        </a>
        {example.after}
      </p>
    </div>
  );
}

export default Area;
