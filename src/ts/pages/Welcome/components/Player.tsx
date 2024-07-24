import React, { useEffect, useState } from 'react';

import UiKitButton from 'ts/components/UiKit/components/Button';
import notifications from 'ts/components/Notifications/store';
import ProgressBar from 'ts/components/ProgressBar';
import settingsApi from 'ts/api/settings';

import style from '../styles/player.module.scss';

enum STATUS {
  PROCESSING = 1,
  PAUSE = 2,
  WAITING = 3,
}

function Player() {
  const [status, setStatus] = useState<any>(STATUS.WAITING);
  const [percent, setPercent] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    async function updateStatus() {
      const response = await settingsApi.getProgress();
      setPercent(response?.progressInPercent ?? null);

      const title = response?.title
        ? `| ${response?.progressInPercent || 0}% | ${response?.title}`
        : '| ожидание запуска';
      setDescription(title);

      let newStatus: any = response?.status;
      if (!newStatus) {
        newStatus = response?.progressInPercent ? STATUS.PROCESSING : STATUS.WAITING;
      }
      setStatus(newStatus);
    }

    const timer = setInterval(updateStatus, 5000);
    updateStatus();

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
            if (status === STATUS.PROCESSING) {
              settingsApi.stop().finally(() => {
                notifications.show('Сервис остановлен.');
              });
            } else {
              settingsApi.start().finally(() => {
                notifications.show('Сервис запущен.');
              });
            }
          }}
        >
          {status === STATUS.PROCESSING ? '||' : '>'}
        </UiKitButton>
        <UiKitButton
          mode="second"
          onClick={() => {
            settingsApi.restart().finally(() => {
              notifications.show('Сервис перезапущен.');
            });
          }}
        >
          {'o'}
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
