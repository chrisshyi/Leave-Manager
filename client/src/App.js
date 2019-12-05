import React, { useEffect, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store";
import CustomNavbar from "./components/layouts/CustomNavbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Summary from "./components/pages/Summary";
import MonthlyView from "./components/pages/MonthlyView";
import AdminPage from "./components/pages/AdminPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import { loadPersonnel } from "./actions/auth";
import PersonnelForm from "./components/pages/PersonnelForm";

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
                        <PrivateRoute
                            exact
                            path="/summary"
                            component={Summary}
                        ></PrivateRoute>
                        <PrivateRoute
                            exact
                            path="/monthly-view"
                            component={MonthlyView}
                        ></PrivateRoute>
                        <PrivateRoute
                            exact
                            path="/admin"
                            component={AdminPage}
                        ></PrivateRoute>
                        <PrivateRoute
                            exact
                            path="/edit-personnel/:personnelId"
                            component={PersonnelForm}
                        ></PrivateRoute>
                        <PrivateRoute
                            exact
                            path="/add-personnel"
                            component={PersonnelForm}
                        ></PrivateRoute>
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
