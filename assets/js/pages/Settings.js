import React, {Component} from "react";

import * as PropTypes from "prop-types";
import {Page, EmptyState, Card, Form, FormLayout, Checkbox, TextField, Button} from "@shopify/polaris";
import {History} from "@shopify/app-bridge/actions";
import {
    Redirect as PageRedirect,
} from "react-router-dom";

import {Redirect, TitleBar} from '@shopify/app-bridge/actions';


export default class Dashboard extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    state = {
        redirectToPage: null,
        newsletter: false,
        email: '',
    };
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
            title: 'Settings',
            buttons: null,
            breadcrumbs: null
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
        const {newsletter, email} = this.state;

        return this.redirectToPage() || (
            <Page title="Settings">
                <Card>
                    <Card.Section>
                        <Form onSubmit={this.handleSubmit}>
                            <FormLayout>
                                <Checkbox
                                    label="Sign up for the Polaris newsletter"
                                    checked={newsletter}
                                    onChange={this.handleChange('newsletter')}
                                />

                                <TextField
                                    value={email}
                                    onChange={this.handleChange('email')}
                                    label="Email"
                                    type="email"
                                    helpText={
                                        <span>
                                        We’ll use this email address to inform you on future changes to
                                        Polaris.
                                        </span>
                                    }
                                />

                                <Button primary submit>Submit</Button>
                            </FormLayout>
                        </Form>
                    </Card.Section>
                </Card>
            </Page>
        );
    }

    handleSubmit = (event) => {
        this.setState({newsletter: false, email: ''});
        console.log(this.state.email);
    };

    handleChange = (field) => {
        return (value) => this.setState({[field]: value});
    };
}
