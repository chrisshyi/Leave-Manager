import React, { useState, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store";
import CustomNavbar from "./components/layouts/CustomNavbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from './components/Landing';
import Summary from './components/Summary';

const App = props => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Fragment>
                    <CustomNavbar />
                    <Switch>
                        <Route exact path="/summary">
                            <Summary />
                        </Route>
                        <Route exact path="/">
                            <Landing />
                        </Route>
                    </Switch>
                </Fragment>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
