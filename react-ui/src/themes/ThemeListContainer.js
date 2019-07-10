import { connect } from 'react-redux';
import ThemeList from './ThemeListComponent';
import { themeOperations } from './duck';

const mapDispatchToProps = dispatch => {
  const getThemeList = page => {
    dispatch(themeOperations.getThemeList(page));
  };
  const doPublishTheme = (themeId, action) => {
    dispatch(themeOperations.doPublishTheme(themeId, action));
  };

  return {
    getThemeList,
    doPublishTheme,
  };
};

const mapStateToProps = state => ({
  themeList: state.themes.themeList,
  publishedTheme: state.themes.publishedTheme,
});
const ThemeListContainer = connect(mapStateToProps, mapDispatchToProps)(ThemeList);

export default ThemeListContainer;
