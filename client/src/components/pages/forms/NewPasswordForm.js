import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from "reactstrap";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import axios from 'axios'; 

const NewPasswordForm = props => {
    const [formData, setFormData] = useState(
        {
            password: "",
            passwordConfirm: ""
        }
    );
    const { password, passwordConfirm } = formData;
    const [ passwordError, setPasswordError ] = useState("");
    const [ resetPasswordMsg, setResetPasswordMsg ] = useState("");
    let location = useLocation();
    let history = useHistory();

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const sendResetPasswordRequest = async () => {
        if (password !== passwordConfirm) {
            setPasswordError("Passwords don't match!");
            setTimeout(() => {
                setPasswordError("");
            }, 3000);
            return;
        }
        try {
            await axios.post(location.pathname, {
                newPassword: password
            });
            setResetPasswordMsg("Reset sucessful! Now redirecting...");
            setTimeout(() => {
                history.push("/");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4" />
                <Col sm="4">
                    <h3>Set new password</h3>
                    {resetPasswordMsg !== "" ? (
                        <Alert color="success">{resetPasswordMsg}</Alert> 
                    ) : (
                        ""
                    )}
                    {passwordError !== "" ? (
                        <Alert color="danger">{passwordError}</Alert>
                    ) : (
                            ""
                        )}
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            sendResetPasswordRequest();
                        }}
                    >
                        <FormGroup>
                            <Label for="personnel-password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={e => onChange(e)}
                                id="personnel-password"
                                placeholder="Enter password"
                                minLength="6"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password-confirm">Confirm Password</Label>
                            <Input
                                type="password"
                                name="passwordConfirm"
                                value={passwordConfirm}
                                onChange={e => onChange(e)}
                                id="password-confirm"
                                placeholder="Enter password again"
                                minLength="6"
                            />
                        </FormGroup>
                        <Button color="success" type="submit">
                            Submit
                        </Button>
                        {"    "}
                    </Form>
                </Col>
                <Col sm="4" />
            </Row>
        </Container>
    );
};


export default withRouter(NewPasswordForm);