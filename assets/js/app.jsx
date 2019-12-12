import * as PropTypes from "prop-types";

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

window.axios = require('axios');

import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
    AppProvider
} from "@shopify/polaris";


import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Settings from "./pages/Settings";

import createApp from '@shopify/app-bridge';
import {TitleBar} from '@shopify/app-bridge/actions';


// Create Shopify App Instance
const app = createApp({
    apiKey: window.shopify_app.api,
    shopOrigin: window.shopify_app.shop,
    forceRedirect: true
});


// Init Title Bar
const appTitleBar = TitleBar.create(app, {});


class App extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        const CustomLinkComponent = ({ children, url, ...rest }) => {
            return (
                <a
                    href={url}
                    {...rest}
                >
                    {children}
                </a>
            );
        };
        //https://github.com/Shopify/product-reviews-polaris-example
        return (
            <AppProvider
                linkComponent={CustomLinkComponent}
            >
                <Router>
                    <Switch>
                        <Route path="/" exact render={(props) => <Dashboard {...props} app={app} titleBar={appTitleBar} />} />
                        <Route path="/settings" render={(props) => <Settings {...props} app={app} titleBar={appTitleBar} />} />
                        <Route path="/about" render={(props) => <About {...props} app={app} titleBar={appTitleBar} />} />
                    </Switch>
                </Router>
            </AppProvider>

        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));