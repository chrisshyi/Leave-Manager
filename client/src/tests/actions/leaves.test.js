import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    getTodayLeaves,
    getMonthlyLeaves,
    scheduleLeave,
    unscheduleLeave,
    addOrEditLeave,
    deleteLeave
} from "../../actions/leaves";
import axios from "axios";
import { GET_TODAY_LEAVES, GET_MONTHLY_LEAVES, LOGOUT } from "../../actions/types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("axios");

describe("Test leave related action creators", () => {
    beforeEach(() => {
        const storageGetItem = jest.spyOn(
            window.localStorage.__proto__,
            "getItem"
        );
        storageGetItem.mockReturnValue("mockToken");
    });
    describe("Tests for getting today's leaves", () => {
        it("Can get today's leaves if token exists in local storage", () => {
            axios.get.mockResolvedValueOnce({
                data: {
                    leaves: [
                        {
                            leaveType: "例假",
                            personnel: "mockId",
                            org: "mockId",
                            scheduled: false,
                            duration: 12
                        }
                    ]
                }
            });
            // console.log(axios.get.mock.calls.length);
            const expectedActions = [
                {
                    type: GET_TODAY_LEAVES,
                    payload: {
                        leaves: [
                            {
                                leaveType: "例假",
                                personnel: "mockId",
                                org: "mockId",
                                scheduled: false,
                                duration: 12
                            }
                        ]
                    }
                }
            ];

            const store = mockStore({
                todayLeaves: {}
            });
            axios.get.mock.calls.length = 0;
            return store.dispatch(getTodayLeaves()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(axios.get.mock.calls.length).toBe(1);
            });
        });
        it("No actions dispatched if no token exists in local storage", () => {
            const storageGetItem = jest.spyOn(
                window.localStorage.__proto__,
                "getItem"
            );
            storageGetItem.mockReturnValue(null);

            axios.get.mockResolvedValueOnce({
                data: {
                    leaves: [
                        {
                            leaveType: "例假",
                            personnel: "mockId",
                            org: "mockId",
                            scheduled: false,
                            duration: 12
                        }
                    ]
                }
            });
            const store = mockStore({
                todayLeaves: {}
            });
            axios.get.mock.calls.length = 0;
            return store.dispatch(getTodayLeaves()).then(() => {
                expect(store.getActions()).toEqual([]);
                expect(axios.get.mock.calls.length).toBe(0);
            });
        });
        it("Logs user out if token has expired", () => {
            axios.get.mockReset(); // CRITICAL!
            axios.get.mockImplementation(() => {
                const err = {};
                err.response = {};
                err.response.data = {};
                err.response.data.msg = "Token expired!";
                throw err;
            });
            const store = mockStore({
                todayLeaves: {}
            });
            const numCalls = axios.get.mock.calls.length;
            return store.dispatch(getTodayLeaves()).then(() => {
                expect(store.getActions()).toEqual([
                    {
                        type: LOGOUT
                    }
                ]);
                expect(axios.get.mock.calls.length).toBe(numCalls + 1);
            });
        });
    });
    describe("Get monthly leaves tests", () => {
        it("Can get monthly leaves when token exists in local storage", () => {
            axios.get.mockResolvedValueOnce({
                data: {
                    leaves: [
                        {
                            leaveType: "例假",
                            personnel: "mockId",
                            org: "mockId",
                            scheduled: false,
                            duration: 12
                        }
                    ]
                }
            });
            const expectedActions = [
                {
                    type: GET_MONTHLY_LEAVES,
                    payload: {
                        leaves: [
                            {
                                leaveType: "例假",
                                personnel: "mockId",
                                org: "mockId",
                                scheduled: false,
                                duration: 12
                            }
                        ]
                    }
                }
            ];

            const store = mockStore({
                monthlyLeaves: {}
            });
            axios.get.mock.calls.length = 0;
            return store.dispatch(getMonthlyLeaves(2019, 10)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(axios.get.mock.calls.length).toBe(1);
            });
        });
        it("Doesn't get monthly leaves if no token exists", () => {
            const storageGetItem = jest.spyOn(
                window.localStorage.__proto__,
                "getItem"
            );
            storageGetItem.mockReturnValue(null);

            axios.get.mockResolvedValueOnce({
                data: {
                    leaves: [
                        {
                            leaveType: "例假",
                            personnel: "mockId",
                            org: "mockId",
                            scheduled: false,
                            duration: 12
                        }
                    ]
                }
            });
            const store = mockStore({
                monthlyLeaves: {}
            });
            axios.get.mock.calls.length = 0;
            return store.dispatch(getMonthlyLeaves(2019, 10)).then(() => {
                expect(store.getActions()).toEqual([]);
                expect(axios.get.mock.calls.length).toBe(0);
            });
        });
        it("Logs user out if token has expired", () => {
            axios.get.mockReset(); // CRITICAL!
            axios.get.mockImplementation(() => {
                const err = {};
                err.response = {};
                err.response.data = {};
                err.response.data.msg = "Token expired!";
                throw err;
            });
            const store = mockStore({
                todayLeaves: {}
            });
            const numCalls = axios.get.mock.calls.length;
            return store.dispatch(getMonthlyLeaves(2019, 10)).then(() => {
                expect(store.getActions()).toEqual([
                    {
                        type: LOGOUT
                    }
                ]);
                expect(axios.get.mock.calls.length).toBe(numCalls + 1);
            });
        });
    });
    describe("Schedule leave tests", () => {

    });
});
