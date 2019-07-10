import React, { Component } from 'react';
import { Layout, Page, DisplayText, Banner, TextContainer, Card, ResourceList, SkeletonPage, SkeletonBodyText, SkeletonDisplayText, Badge, Stack } from '@shopify/polaris';
import { Alert } from '@shopify/polaris/embedded';
import AppFooter from '../footer';

class ThemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOkModal: false,
      showConfirmPublishModal: false,
      themeToPublish: null,
      curPage: 1
    };

    this.hideOkModal = this.hideOkModal.bind(this);
  }

  componentWillMount() {
    // Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    // always reset that global state back to null when you REMOUNT
    this.props.getThemeList(1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.publishedTheme.theme !== nextProps.publishedTheme.theme && !nextProps.publishedTheme.error) {
      this.setState({ showOkModal: true });
      this.props.getThemeList(1);
    }
  }

  renderError(prop) {
    if (prop && prop.error && prop.error.status === 500) {
      return (
        <Banner title="Internal Server Error occurred" status="critical">
          <p>Oops, something went wrong... Please, try again</p>
        </Banner>
      );
    }
    return <span />;
  }

  render() {
    const { themes, loading } = this.props.themeList;
    const { themeList, doPublishTheme } = this.props;

    return (
      <div>
        {!loading && (
          <Page
            icon="/images/favicon.png"
            title="Theme List"
          >
            <Alert open={this.state.showOkModal} onConfirm={this.hideOkModal} onClose={this.hideOkModal} confirmContent="OK">
              Theme has been successfully published
            </Alert>
            <Alert
              title="Publish theme"
              open={this.state.showConfirmPublishModal}
              destructive
              confirmContent="Confirm"
              cancelContent="Discard"
              onConfirm={() => {
                this.setState({ showConfirmPublishModal: false });
                doPublishTheme(this.state.themeToPublish, true);
              }}
              onCancel={() => this.setState({ showConfirmPublishModal: false })}
              onClose={() => this.setState({ showConfirmPublishModal: false })}
            >
              You are about to publish selected theme. Please, confirm...
            </Alert>
            <Layout>
              <Layout.Section>
                <Layout>
                  <Layout.Section>
                    <TextContainer spacing="tight">
                      <DisplayText size="medium">Theme List</DisplayText>
                      <p>Here are your store themes. You can publish one of them.</p>
                    </TextContainer>
                    <br />
                    {!loading && this.renderError(themeList)}
                  </Layout.Section>
                  <Layout.Section>
                    <Card sectioned>
                      {!loading &&
                        themes.length > 0 && (
                          <div>
                            <ResourceList
                              resourceName={{ singular: 'theme', plural: 'themes' }}
                              items={themes.map((theme, i) => ({
                                index: i,
                                theme_id: theme.id.toString(),
                                name: theme.name,
                                role: theme.role,
                              }))}
                              idForItem={item => item.theme_id}
                              renderItem={item => {
                                const { theme_id, name, role } = item;
                                const shortcutActions = role !== 'main' ? [
                                  {
                                    content: 'Publish',
                                    onAction: () => {
                                      this.setState({ themeToPublish: theme_id });
                                      this.setState({ showConfirmPublishModal: true });
                                    }
                                  },
                                ] : null;
                                return (
                                  <ResourceList.Item id={theme_id} shortcutActions={shortcutActions}>
                                    <Stack>
                                      <h2>{ name }</h2>
                                      {role === 'main' ? <Badge status="success">Published</Badge> : ''}
                                    </Stack>
                                  </ResourceList.Item>
                                );
                              }}
                            />
                          </div>
                        )}
                    </Card>
                  </Layout.Section>
                </Layout>
              </Layout.Section>
              <Layout.Section>
                <AppFooter />
              </Layout.Section>
            </Layout>
          </Page>
        )}
        {loading && (
          <SkeletonPage secondaryActions={2}>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <SkeletonBodyText />
                </Card>
                <Card sectioned>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
                <Card sectioned>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
              </Layout.Section>
            </Layout>
          </SkeletonPage>
        )}
      </div>
    );
  }

  hideOkModal() {
    this.setState({ showOkModal: false });
    this.setState({ selectedThemes: [] });
    this.props.getThemeList();
  }
}

export default ThemeList;
