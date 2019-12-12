import React, {Component} from "react";

import * as PropTypes from "prop-types";
import {Page, EmptyState, Card} from "@shopify/polaris";
import {History} from "@shopify/app-bridge/actions";
import {
    Redirect as PageRedirect,
} from "react-router-dom";

import {Button, Redirect} from '@shopify/app-bridge/actions';


export default class Dashboard extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    state = {redirectToPage: null};
    polaris = {
        app: null,
        history: null,
        redirect: null,
    }

    componentDidMount() {
        // Init Shopify App Attributes
        this.polaris.app = this.props.app;
        this.polaris.history = History.create(this.polaris.app);
        this.polaris.redirect = Redirect.create(this.polaris.app);

        // Customize Page Title
        /*
        const breadcrumb = Button.create(this.polaris.app, {label: 'Dashboard'});
        breadcrumb.subscribe(Button.Action.CLICK, () => {
            this.props.app.dispatch(Redirect.toApp({path: '/'}));
        });
        */

        this.props.titleBar.set({
            title: 'About',
            buttons: null,
            breadcrumbs: null, //breadcrumb,
        });

        this.cleanup = this.polaris.app.subscribe(Redirect.ActionType.APP, ({path}) => {
            this.goTo(path);
        });
    }

    componentWillUnmount() {
        // Clean up subscriptions when component unmounts
        this.props.titleBar.unsubscribe();
        this.cleanup();
    }

    goTo(path) {
        return this.setState({redirectToPage: path});
    }

    redirectToPage() {
        if (!this.state.redirectToPage)
            return false;
        this.polaris.history.dispatch(History.Action.PUSH, this.state.redirectToPage);
        return <PageRedirect push to={`${this.state.redirectToPage}`}/>;
    }

    // Render the Page
    render() {
        return this.redirectToPage() || (
            <Page title="About"
                  breadcrumbs={[
                      {
                          content: "Dashboard",
                          onAction: () => {
                              this.goTo('/')
                          }
                      }
                  ]}
                  secondaryActions={[
                      {content: "Support"},
                      {content: "FAQ"}
                  ]}
                  actionGroups={[
                      {
                          title: "Promote",
                          actions: [
                              {
                                  content: "Share on Facebook",
                                  onAction: false
                              },
                              {
                                  content: "Share on Pinterest",
                                  onAction: false
                              }
                          ]
                      }
                  ]}
            >
                <Card title="About">
                    <Card.Section>
                        <p>About</p>
                    </Card.Section>

                    <Card.Section>
                        <p>
                            A sample about page.
                        </p>
                    </Card.Section>
                </Card>
            </Page>
        );
    }
}
