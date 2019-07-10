import axios from 'axios';
import types from './types';
import { cachedFetch } from '../../cache';

const ROOT_URL = '/api';

const fetchThemes = page => {
  const url = `${ROOT_URL}/themes`;
  const request = cachedFetch(url);
  return {
    type: types.FETCH_THEMES,
    payload: request,
    url
  };
};

const fetchThemesSuccess = themes => ({
  type: types.FETCH_THEMES_SUCCESS,
  payload: themes
});

const fetchThemesFailure = error => ({
  type: types.FETCH_THEMES_FAILURE,
  payload: error
});

const publishTheme = (themeId, action) => {
  const request = axios({
    method: 'post',
    data: { theme_id: themeId, action },
    url: `${ROOT_URL}/themes/publish`
  });

  return {
    type: types.PUBLISH_THEME,
    payload: request
  };
};

const publishThemeSuccess = response => ({
  type: types.PUBLISH_THEME_SUCCESS,
  payload: response
});

const publishThemeFailure = response => ({
  type: types.PUBLISH_THEME_FAILURE,
  payload: response
});


export {
  ROOT_URL,
  fetchThemes,
  fetchThemesSuccess,
  fetchThemesFailure,
  publishTheme,
  publishThemeSuccess,
  publishThemeFailure
};
