import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// Renames component to Component
const PrivateRoute = ({ component: Component, auth, ...rest}) => {
    return (
        <Route {...rest} render={props => !auth.isAuthenticated && !auth.loading ? 
            (<Redirect to="/"></Redirect>) :
            (<Component {...props} />)
        }/>
    )
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}


const mapStateToProps = state => ({
    auth: state.auth
});
    


export default connect(mapStateToProps, null)(PrivateRoute);
