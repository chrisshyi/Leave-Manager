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
import { Link, useParams, withRouter, Redirect } from "react-router-dom";
import { addOrEditPersonnel } from "../../../actions/personnel";
import { connect } from "react-redux";

const PersonnelForm = props => {
    const {
        nameToEdit,
        roleToEdit,
        titleToEdit,
        passwordToEdit,
        edit,
        org
    } = props.location.state;
    let { personnelId } = useParams();
    const [formData, setFormData] = useState(
        edit
            ? {
                  name: nameToEdit,
                  role: roleToEdit,
                  title: titleToEdit,
                  password: passwordToEdit,
                  org
              }
            : {
                  name: "",
                  role: "",
                  title: "",
                  password: "",
                  org
              }
    );
    if (!org) {
        return <Redirect to="/" />
    }
    const { errors, addOrEditPersonnel } = props;

    const { name, role, title, email, password } = formData;

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4" />
                <Col sm="4">
                    <h3>{edit ? "Edit" : "Add"} Personnel</h3>
                    {errors.errMsg !== "" ? (
                        <Alert color="danger">{errors.errMsg}</Alert>
                    ) : (
                        ""
                    )}
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            addOrEditPersonnel(
                                personnelId,
                                formData,
                                edit,
                                props.history
                            );
                        }}
                    >
                        <FormGroup>
                            <Label for="personnel-name">Name</Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={e => onChange(e)}
                                name="name"
                                id="personnel-name"
                                required
                            />
                        </FormGroup>
                        {edit ? (
                            ""
                        ) : (
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
                        )}
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
                            <Label for="personnel-role">Role</Label>
                            <Input
                                type="select"
                                value={role}
                                onChange={e => onChange(e)}
                                name="role"
                                id="personnel-role"
                                required
                            >
                                <option disabled defaultValue value="">
                                    {" "}
                                    -- select a role --{" "}
                                </option>
                                <option value="reg-user">Regular User</option>
                                <option value="HR-admin">
                                    HR Administrator
                                </option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="personnel-title">Title</Label>
                            <Input
                                value={title}
                                onChange={e => onChange(e)}
                                type="text"
                                name="title"
                                id="personnel-title"
                                required
                            />
                        </FormGroup>
                        <Button color="success" type="submit">
                            Submit
                        </Button>
                        {"    "}
                        <Link to="/admin">
                            <Button color="danger">Back</Button>
                        </Link>
                    </Form>
                </Col>
                <Col sm="4" />
            </Row>
        </Container>
    );
};

PersonnelForm.propTypes = {
    addOrEditPersonnel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps, { addOrEditPersonnel })(
    withRouter(PersonnelForm)
);
