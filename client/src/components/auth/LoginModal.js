import PropTypes from "prop-types";
import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from "reactstrap";
import { Link } from 'react-router-dom';
import { login } from "../../actions/auth";
import { connect } from "react-redux";
const LoginModal = props => {
    const { auth, login, buttonLabel, errors } = props;

    const [modal, setModal] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const toggle = () => setModal(!modal);

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        const { email, password } = formData;
        login(email, password);
        if (auth.isAuthenticated) {
            toggle();
        }
    };

    return (
        <div className="mt-3">
            <div>
                <h1 className="display-3">Welcome!</h1>
                <p className="lead">Log in, or create a new organization</p>
                <hr className="my-2" />
                <p className="lead">
                    <Button color="primary" onClick={toggle} className="mr-3">
                        {buttonLabel}
                    </Button>
                    <Link to="/sign-up">
                        <Button outline color="success">
                            Sign Up{" "}
                        </Button>
                    </Link>
                </p>
            </div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Login</ModalHeader>
                <ModalBody>
                    {errors.errMsg !== "" ? (
                        <Alert color="danger">{errors.errMsg}</Alert>
                    ) : (
                        ""
                    )}
                    <Form id="login-form" onSubmit={e => onSubmit(e)}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                onChange={e => onChange(e)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                onChange={e => onChange(e)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit" form="login-form">
                        Submit
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

LoginModal.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { login })(LoginModal);
