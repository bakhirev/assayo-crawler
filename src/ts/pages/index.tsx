import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DropZone from 'ts/components/DropZone';

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
        onChange={(type: string, data: any[]) => {
          console.log('x');
        }}
      />
    </>
  );
});

export default Main;
