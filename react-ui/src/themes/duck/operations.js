import {
  fetchThemes,
  fetchThemesSuccess,
  fetchThemesFailure,
  publishTheme,
  publishThemeSuccess,
  publishThemeFailure,
  ROOT_URL
} from './actions';

import { pushCache, refreshCache } from '../../cache';

const getThemeList = page => dispatch => {
  const response = dispatch(fetchThemes(page));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        pushCache(response.url, result);
        dispatch(fetchThemesSuccess(result.data));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(fetchThemesFailure(error.response));
        window.scrollTo(0, 0);
      }
    });
};

const doPublishTheme = (themeId, action) => dispatch => {
  const response = dispatch(publishTheme(themeId, action));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        refreshCache(`${ROOT_URL}/themes`);
        dispatch(publishThemeSuccess(result.data));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(publishThemeFailure(error.response));
        window.scrollTo(0, 0);
      }
    });
};

export default {
  getThemeList,
  doPublishTheme
};
