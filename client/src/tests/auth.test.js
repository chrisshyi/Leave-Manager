import React from 'react';
import { renderWithRedux } from "./test_utils";
import axios from 'axios';
import LoginModal from '../components/auth/LoginModal';
import { prettyDOM, fireEvent, wait, waitForElement, waitForDomChange, waitForElementToBeRemoved } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios');

test('User can log in using the LoginModal component', async () => {
    const authURL = '/api/auth';
    const { container, store, getByLabelText, getByText } = renderWithRedux(<LoginModal buttonLabel={"Login"} />);
    fireEvent.click(getByText('Login'));
    await waitForElement(() => getByLabelText('Email'));
    getByLabelText('Email');
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testUser@gmail.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'somePassWord' } });

    axios.post.mockResolvedValueOnce({
        data: {
            token: "mockToken"
        }
    });
    fireEvent.click(getByText('Submit'));

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(authURL);
    const currentState = store.getState();
    expect(currentState.auth.token).toMatch('mockToken');
    expect(localStorage.getItem('token')).toMatch('mockToken');
    expect(currentState.isAuthenticated).toBe(true);
    expect(currentState.loading).toBe(false);
    
});
