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
import { login } from '../../actions/auth';
import { connect } from 'react-redux';
const LoginModal = props => {

    const { auth, login, buttonLabel } = props;

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
    }

    return (
        <div className="mt-3">
            <div>
                <h1 className="display-3">Welcome!</h1>
                <p className="lead">
                    Please log in with your credentials
                </p>
                <hr className="my-2" />
                <p className="lead">
                    <Button color="primary" onClick={toggle}>
                        {buttonLabel}
                    </Button>
                </p>
            </div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Login</ModalHeader>
                <ModalBody>
                    { auth.errorMsg !== '' ? <Alert color="danger">{auth.errorMsg}</Alert> : ''}
                    <Form id="login-form" onSubmit={e => onSubmit(e)}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="text"
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
                    <Button color="primary" type="submit" form='login-form'>
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
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { login })(LoginModal);
