import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Renames component to Component
const AdminPrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                auth.personnel.role === "reg-user" ? (
                    <Redirect to="/"></Redirect>
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

AdminPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AdminPrivateRoute);
