import React, { useEffect, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store";
import CustomNavbar from "./components/layouts/CustomNavbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from './components/pages/Landing';
import Summary from './components/pages/Summary';
import MonthlyView from './components/pages/MonthlyView';
import { loadPersonnel } from './actions/auth';

const App = () => {
    useEffect(() => {
        store.dispatch(loadPersonnel());
    }, [loadPersonnel]);
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Fragment>
                    <CustomNavbar />
                    <Switch>
                        <Route exact path="/summary">
                            <Summary />
                        </Route>
                        <Route exact path='/monthly-view' component={MonthlyView}>
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
