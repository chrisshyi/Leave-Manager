/// <reference types="Cypress" />
import { testUserLogin } from "./utils";
import moment from "moment";

before(() => {
    cy.exec("node scripts/seedLeaves.js");
    testUserLogin();
});

beforeEach(() => {
    testUserLogin();
});

describe("Test users' interaction with the monthly view", () => {
    it("User can view leaves correctly", () => {
        cy.visit("/");
        cy.contains("View Month").click();
        const today = new Date();
        cy.url().should(
            "equal",
            `http://localhost:3000/monthly-view?year=${today.getFullYear()}&month=${today.getMonth() +
                1}`
        );
        cy.contains("例假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate()}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells").each((value, index) => {
            if (index !== 0) {
                cy.wrap(value).should("contain", "例假");
            }
        });
    });

    it("User can schedule a leave", () => {
        const today = new Date();
        cy.visit("/");
        cy.contains("View Month").click();
        cy.contains("例假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate() + 1}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells")
            .eq(2)
            .click();
        cy.contains("Add Leave");
        cy.contains("Available Leaves")
            .next()
            .select("慰假 12/01");
        cy.contains("Schedule").click();
        cy.contains("慰假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate() + 1}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells")
            .eq(2)
            .should("contain", "慰假");
    });
    it("User can unschedule a leave", () => {
        const today = new Date();
        cy.visit("/");
        cy.contains("View Month").click();
        cy.contains("例假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate()}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells")
            .eq(2)
            .click();
        cy.contains("Remove Leave");
        cy.server(); // start a server so we can wait on the following requests
        cy.route("PUT", "/api/leaves/*").as("modifyLeave");
        cy.route("GET", "/api/leaves/*").as("requestLeaves");
        cy.contains("Unschedule").click();
        cy.wait("@modifyLeave");
        cy.wait("@requestLeaves");
        
        cy.contains(`${today.getMonth() + 1}/${today.getDate()}`)
            .siblings()
            .eq(2)
            .should("not.contain", "例假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate()}`)
            .siblings()
            .eq(2)
            .click();
        cy.contains("Available Leaves")
            .next()
            .select("例假");
    });
    it("User can view the current month and navigate to the next and previous months", () => {
        const today = moment();
        cy.visit("/");
        cy.contains("View Month").click();
        cy.url().should(
            "equal",
            `http://localhost:3000/monthly-view?year=${today.year()}&month=${today.month() +
                1}`
        );
        cy.contains("Next").click();
        const nextMonth = moment()
            .startOf("month")
            .add(1, "months");
        cy.url().should(
            "equal",
            `http://localhost:3000/monthly-view?year=${nextMonth.year()}&month=${nextMonth.month() +
                1}`
        );
        cy.visit("/");
        cy.contains("View Month").click();
        cy.contains("Prev").click();
        const lastMonth = moment()
            .startOf("month")
            .subtract(1, "months");
        cy.url().should(
            "equal",
            `http://localhost:3000/monthly-view?year=${lastMonth.year()}&month=${lastMonth.month() +
                1}`
        );
    });
});
