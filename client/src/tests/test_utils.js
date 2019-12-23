import React from 'react';
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import store from '../store';

export function renderWithRedux(ui) {
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        // adding `store` to the returned utilities to allow us
        // to reference it in our tests (just try to avoid using
        // this to test implementation details).
        store
    };
}
