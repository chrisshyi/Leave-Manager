import React, { useState } from "react";
import {
    Row,
    Col,
    Form,
    Input,
    FormGroup,
    Label,
    Button,
    Container,
    Alert
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { signUp } from '../../../actions/auth';
import { connect } from 'react-redux';

const OrgForm = props => {
    const { isAuthenticated, signUp, errors } = props;
    const [formData, setFormData] = useState({
        orgName: "",
        personnelName: "",
        password: "",
        email: "",
        title: ""
    });
    const { title, orgName, personnelName, password, email } = formData;
    const history = useHistory();

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    if (isAuthenticated) {
        history.push('/summary');
    }
    const createOrg = () => {
        signUp(orgName, personnelName, email, password, title, history);
    };
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4" />
                <Col sm="4">
                    {errors.errMsg !== "" ? (
                        <Alert color="danger">{errors.errMsg}</Alert>
                    ) : (
                        ""
                    )}
                    <h3>Create Organization</h3>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            createOrg();
                        }}
                    >
                        <FormGroup>
                            <Label for="org-name">Name of Organization</Label>
                            <Input
                                type="text"
                                name="orgName"
                                required
                                value={orgName}
                                onChange={e => onChange(e)}
                                id="org-name"
                            />
                        </FormGroup>
                        <h4>Admin Information</h4>
                        <FormGroup>
                            <Label for="personnel-email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={email}
                                onChange={e => onChange(e)}
                                id="personnel-email"
                                placeholder="Enter an email"
                                required
                            />
                        </FormGroup>
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
                            <Label for="personnel-name">Name</Label>
                            <Input
                                type="text"
                                value={personnelName}
                                onChange={e => onChange(e)}
                                name="personnelName"
                                id="personnel-name"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="personnel-title">Title</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={e => onChange(e)}
                                name="title"
                                id="personnel-title"
                                required
                            />
                        </FormGroup>
                        <Button color="success" type="submit">
                            Submit
                        </Button>
                        {"    "}
                        <Link to={"/"}>
                            <Button color="danger">Back</Button>
                        </Link>
                    </Form>
                </Col>
                <Col sm="4" />
            </Row>
        </Container>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.errors
})

export default connect(mapStateToProps, { signUp })(OrgForm);
