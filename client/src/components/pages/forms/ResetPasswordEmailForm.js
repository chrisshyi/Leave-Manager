import React from 'react';
import {
    useState,
    Fragment
} from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Container,
    Row,
    Col
} from 'reactstrap';
import axios from 'axios';

const sendResetEmail = async email => {
    try {
        const res = await axios.post("/api/auth/reset_pw", { email });
    } catch (error) {
        console.log(error);
    }
};

const ResetPasswordEmailForm = props => {
    const [resetEmail, setResetEmail] = useState("");
    const [emailSubmitted, setEmailSubmitted] = useState(false);


    const body = emailSubmitted ? (
        <p>
            If the email is in our system, an email with the reset link will be sent to the
            address you've entered
        </p>
    )
        :
        (
            <Fragment>
                <h3>
                    Resetting Your Password
                </h3>
                <p>
                    Give us some information about your account
                </p>
                <Form
                    onSubmit={
                        e => {
                            e.preventDefault();
                            sendResetEmail(resetEmail);
                            setEmailSubmitted(true);
                        }
                    }
                >
                    <FormGroup>
                        <Label for="resetEmail">Email</Label>
                        <Input type="email" name="resetEmail" id="resetEmail" placeholder="Enter your email"
                            onChange={e => setResetEmail(e.target.value)}
                        />
                    </FormGroup>
                    <Button color="primary">Submit</Button>
                </Form>

            </Fragment>
        )

    return (
    <Container>
        <Row className="mt-5">
            <Col sm="4"></Col>
            <Col sm="4">
                {body}
            </Col>
            <Col sm="4"></Col>
        </Row>
    </Container>
    );
}
export default ResetPasswordEmailForm;
