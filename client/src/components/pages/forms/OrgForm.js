import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Row,
    Col,
    Form,
    Input,
    FormGroup,
    Label,
    Button,
    Container
} from "reactstrap";
import { Link } from 'react-router-dom';

const OrgForm = props => {
    const [formData, setFormData] = useState({
        orgName: ""
    });
    const { orgName } = formData;

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
                    <h3>Create Organization</h3>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                        }}
                    >
                        <FormGroup>
                            <Label for="org-name">Name of Organization</Label>
                            <Input
                                type="text"
                                name="orgName"
                                value={orgName}
                                onChange={e => onChange(e)}
                                id="org-name"
                            />
                        </FormGroup>
                        <Button color="success">Next</Button>
                        {"    "}
                        <Link to={'/'}>
                            <Button color="danger">Back</Button>
                        </Link>
                    </Form>
                </Col>
                <Col sm="4" />
            </Row>
        </Container>
    );
};

OrgForm.propTypes = {};

export default OrgForm;
