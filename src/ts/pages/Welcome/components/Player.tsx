import React, { useEffect, useState } from 'react';

import UiKitButton from 'ts/components/UiKit/components/Button';
import notifications from 'ts/components/Notifications/store';
import ProgressBar from 'ts/components/ProgressBar';
import settingsApi from 'ts/api/settings';

import getProgressTitleByStatus from '../helpers/getProgressTitleByStatus';
import style from '../styles/player.module.scss';

enum STATUS {
  PROCESSING = 1,
  PAUSE = 2,
  WAITING = 3,
  RESTART = 4,
}

function Player() {
  const [status, setStatus] = useState<any>(STATUS.WAITING);
  const [percent, setPercent] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    async function fetchStatus() {
      const response = await settingsApi.getProgress();
      setPercent(response?.progressInPercent ?? null);
      setDescription(getProgressTitleByStatus(response));

      const defaultStatus = response?.progressInPercent ? STATUS.PROCESSING : STATUS.WAITING;
      setStatus(response?.status || defaultStatus);
    }

    const timer = setInterval(fetchStatus, 1000);
    fetchStatus();

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={style.welcome_player}>
      <div className={style.welcome_player_buttons}>
        <UiKitButton
          mode="second"
          onClick={() => {
            if (status === STATUS.PROCESSING || status === STATUS.RESTART) {
              settingsApi.pause().finally(() => {
                notifications.show('Сервис остановлен.');
              });
            } else {
              settingsApi.start().finally(() => {
                notifications.show('Сервис запущен.');
              });
            }
          }}
        >
          <img
            alt="Play or pause icon"
            src={status === STATUS.PROCESSING || status === STATUS.RESTART
              ? './assets/player/pause.svg'
              : './assets/player/play.svg'}
            className={style.welcome_player_icon}
          />
        </UiKitButton>
        <UiKitButton
          mode="second"
          disabled={status === STATUS.WAITING || status === STATUS.RESTART}
          onClick={() => {
            settingsApi.restart().finally(() => {
              setPercent(0);
              setDescription('');
              setStatus(STATUS.RESTART);
              notifications.show('Сервис перезапущен.');
            });
          }}
        >
          <img
            alt="Replay icon"
            src="./assets/player/replay.svg"
            className={style.welcome_player_icon}
          />
        </UiKitButton>
      </div>
      <div className={style.welcome_player_progress}>
        <ProgressBar percent={percent}/>
        <div className={style.welcome_player_description}>
          {description}
        </div>
      </div>
    </div>
  );
}

export default Player;
