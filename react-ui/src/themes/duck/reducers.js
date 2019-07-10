import types from './types';

const INITIAL_STATE = {
  themeList: { themes: [], count: 0, error: null, loading: false },
  publishedTheme: { theme: null, error: null, loading: false }
};

const themeReducer = (state = INITIAL_STATE, action) => {
  let error;
  switch (action.type) {
    case types.FETCH_THEMES: // start fetching themes and set loading = true
      return { ...state, themeList: { themes: [], error: null, loading: true } };
    case types.FETCH_THEMES_SUCCESS: // return list of themes and make loading = false
      return { ...state, themeList: { themes: action.payload.themes, error: null, loading: false } };
    case types.FETCH_THEMES_FAILURE: // return error and make loading = false
      error = { message: action.payload.data.errors ? action.payload.data.errors : null, status: action.payload.status };
      return { ...state, themeList: { themes: [], error, loading: false } };
    case types.RESET_THEMES: // reset themeList to initial state
      return { ...state, themeList: { themes: [], error: null, loading: false } };

    case types.PUBLISH_THEME:
      return { ...state, publishedTheme: { theme: null, error: null, loading: true } };
    case types.PUBLISH_THEME_SUCCESS:
      return { ...state, publishedTheme: { theme: action.payload.theme, error: null, loading: false } };
    case types.PUBLISH_THEME_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null, status: action.payload.status };
      return { ...state, publishedTheme: { theme: null, error, loading: false } };

    default:
      return state;
  }
};

export default themeReducer;
