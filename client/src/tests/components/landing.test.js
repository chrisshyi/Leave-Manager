import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Landing } from '../../components/pages/Landing';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe("A basic test", () => {
    it("basic test", () => {
        const wrapper = shallow(<Landing isAuthenticated={true} />);
        // expect(wrapper.find('h3')).toIncludeText('Welcome');
    });
});