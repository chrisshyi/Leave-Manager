import React from 'react'
import PropTypes from 'prop-types'

const AddLeaveForm = props => {
    // stub
    const [formData, setFormData] = useState({
        leaveType: "",
        scheduled: false,
        originalDate: "",
        scheduledDate: "",
        duration: 0
    });
    return (
        <div>
        const { leaveType, originalDate, duration } = formData;
        const onChange = e => {
            e.preventDefault();
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        modalBody = (
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="leave-type-select">Select</Label>
                        <Input
                            onChange={e => onChange(e)}
                            value={leaveType}
                            type="select"
                            name="leaveType"
                            id="leave-type-select"
                        >
                            <option>慰假</option>
                            <option>榮譽假</option>
                            <option>例假</option>
                            <option>公假</option>
                            <option>外散</option>
                            <option>外宿</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="original-date">Original Date</Label>
                        <Input type="date" id="original-date" 
                        name="originalDate"
                        value={originalDate}
                        onChange={e => onChange(e)}
                        ></Input>

                    </FormGroup>
                    <FormGroup>
                        <Label for="scheduled-date">Scheduled Date</Label>
                        <Input
                            disabled
                            id="scheduled-date"
                            type="text"
                            value={editLeaveDate.format("MM/DD")}
                        ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="duration">Duration</Label>
                        <Input
                            type="number"
                            name="duration"
                            id="duration"
                            value={duration}
                            onChange={e => onChange(e)}
                        ></Input>
                    </FormGroup>
                </Form>
            </ModalBody>
        );
            
        </div>
    )
}

AddLeaveForm.propTypes = {

}

export default AddLeaveForm
