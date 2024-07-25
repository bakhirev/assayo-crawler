import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DropZone from 'ts/components/DropZone';
import notifications from 'ts/components/Notifications/store';
import settingsApi from 'ts/api/settings';

import Welcome from './Welcome/index';

const Main = observer(() => {
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={(
            <Welcome />
          )}
        />
      </Routes>
      <DropZone
        onChange={(type: string, json: any) => {
          if (type === 'config') {
            settingsApi.updateSettings(json)
              .then(() => {
                notifications.show('Конфигурация обновленна.');
              });
          }

          if (type === 'reports') {
            settingsApi.updateReports(json)
              .then(() => {
                notifications.show('Список заданий обновлён.');
              });
          }
        }}
      />
    </>
  );
});

export default Main;
