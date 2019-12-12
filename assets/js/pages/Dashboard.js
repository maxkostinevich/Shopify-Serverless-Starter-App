import React, { Component } from "react";

import * as PropTypes from "prop-types";
import { Page, EmptyState } from "@shopify/polaris";
import { History } from "@shopify/app-bridge/actions";
import {
    Redirect as PageRedirect,
} from "react-router-dom";

import {Button, Redirect} from '@shopify/app-bridge/actions';


export default class Dashboard extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    state = { redirectToPage: null };
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
        this.props.titleBar.set({
            title: 'Dashboard',
            buttons: null,
            breadcrumbs: null
        });

        //
        this.cleanup = this.polaris.app.subscribe(Redirect.ActionType.APP, ({ path }) => {

        });
    }

    componentWillUnmount() {
        // Clean up subscriptions when component unmounts
        this.cleanup();
    }

    goTo(path){
        return this.setState({ redirectToPage: path });
    }
    redirectToPage() {
        if (!this.state.redirectToPage)
            return false;
        this.polaris.history.dispatch(History.Action.PUSH, this.state.redirectToPage);
        return <PageRedirect push to={`${this.state.redirectToPage}`} />;
    }

    // Render the Page
    render() {
        return this.redirectToPage() || (
            <Page title="Dashboard" titleHidden={true}>
            <EmptyState
        heading={`Welcome to the ${window.shopify_app.name}`}
        action={{
            content: "About",
                onAction: () => {
                this.goTo('/about')
            }
        }}
        secondaryAction={{
            content: "Settings",
                onAction: () => {
                this.goTo('/settings')
            }
        }}
        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
            >
            <p>
            Sample dashboard page.
        </p>
        </EmptyState>
        </Page>
    );
    }
}