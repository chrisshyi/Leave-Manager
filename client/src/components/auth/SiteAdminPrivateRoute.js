import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Renames component to Component
const SiteAdminPrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                auth.personnel && auth.personnel.role !== 'site-admin' ? (
                    <Redirect to="/"></Redirect>
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

SiteAdminPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(SiteAdminPrivateRoute);
