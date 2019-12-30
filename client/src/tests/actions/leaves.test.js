import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    getTodayLeaves,
    getMonthlyLeaves,
    getAvailableLeaves,
    scheduleLeave,
    unscheduleLeave,
    addOrEditLeave,
    deleteLeave
} from "../../actions/leaves";
import axios from "axios";
import { GET_TODAY_LEAVES } from "../../actions/types";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("axios");


describe("Test leave related action creators", async () => {
    beforeAll(() => {
        // const localStorageMock = {
        //     getItem: jest.fn(),
        //     setItem: jest.fn(),
        //     clear: jest.fn()
        // };
        // localStorageMock.getItem.mockReturnValue("mockToken");
        // global.localStorage = localStorageMock;
        const storageGetItem = jest.spyOn(window.localStorage.__proto__, 'getItem');
        storageGetItem.mockReturnValue("mockToken");
    });
    it("Can get today's leaves", () => {
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
        store.dispatch(getTodayLeaves()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
