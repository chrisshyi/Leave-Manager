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
    Input
} from "reactstrap";
import { Link } from 'react-router-dom';

const PersonnelForm = props => {
    const { nameToEdit, roleToEdit, titleToEdit, edit } = props.location.state;
    const [formData, setFormData] = useState(
        edit
            ? {
                  name: nameToEdit,
                  role: roleToEdit,
                  title: titleToEdit
              }
            : {
                  name: "",
                  role: "",
                  title: ""
              }
    );

    const { name, role, title } = formData;

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    return (
        <Container>
            <Row className="mt-5">
                <Col sm="4"></Col>
                <Col sm="4">
                    <h3>{edit ? 'Edit' : 'Add'} Personnel</h3>
                    <Form>
                        <FormGroup>
                            <Label for="personnel-name">Name</Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={e => onChange(e)}
                                name="name"
                                id="personnel-name"
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="personnel-role">Role</Label>
                            <Input
                                type="select"
                                value={role}
                                onChange={e => onChange(e)}
                                name="role"
                                id="personnel-role"
                            >
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
                            ></Input>
                        </FormGroup>
                        <Button color="success">Submit</Button>{'    '}
                        <Link to="/admin">
                            <Button color="danger">
                                Back
                            </Button>
                        </Link>
                    </Form>
                </Col>
                <Col sm="4"></Col>
            </Row>
        </Container>
    );
};

PersonnelForm.propTypes = {};

export default PersonnelForm;
