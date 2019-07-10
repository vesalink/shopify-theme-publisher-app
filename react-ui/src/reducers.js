import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import themeReducer from './themes/duck/reducers';

const rootReducer = combineReducers({
  router: routerReducer,
  themes: themeReducer,
});

export default rootReducer;
