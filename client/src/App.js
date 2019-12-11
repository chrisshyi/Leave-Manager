import React, { useEffect, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store";
import CustomNavbar from "./components/layouts/CustomNavbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Summary from "./components/pages/Summary";
import MonthlyView from "./components/pages/MonthlyView";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminPrivateRoute from './components/auth/AdminPrivateRoute';
import { loadPersonnel } from "./actions/auth";
import PersonnelForm from "./components/pages/forms/PersonnelForm";
import LeaveForm from './components/pages/forms/LeaveForm';
import PersonnelLeaveAdmin from './components/pages/admin/PersonnelLeaveAdmin';
import PersonnelAdmin from './components/pages/admin/PersonnelAdmin';

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
                        <AdminPrivateRoute
                            exact
                            path="/admin"
                            component={PersonnelAdmin}
                        ></AdminPrivateRoute>
                        <AdminPrivateRoute
                            exact
                            path="/edit-personnel/:personnelId"
                            component={PersonnelForm}
                        ></AdminPrivateRoute>
                        <AdminPrivateRoute
                            exact
                            path='/edit-personnel-leaves/:personnelId'
                            component={PersonnelLeaveAdmin}
                            >
                        </AdminPrivateRoute>
                        <AdminPrivateRoute
                            exact
                            path="/add-personnel"
                            component={PersonnelForm}
                        ></AdminPrivateRoute>
                        <AdminPrivateRoute
                            exact
                            path="/add-leave"
                            component={LeaveForm}
                        ></AdminPrivateRoute>
                        <AdminPrivateRoute
                            exact
                            path="/edit-leave/:leaveId"
                            component={LeaveForm}
                        ></AdminPrivateRoute>
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
