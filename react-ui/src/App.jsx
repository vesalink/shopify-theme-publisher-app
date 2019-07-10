import React from 'react';
import { Route } from 'react-router-dom';

import ThemeList from './themes/ThemeListContainer';

const App = () => (
  <div>
    <Route exact path="/" component={ThemeList} />
  </div>
);

export default App;
