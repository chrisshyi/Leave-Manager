/// <reference types="Cypress" />
import { testUserLogin } from "./utils";

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

    it("User can add a leave", () => {
        const today = new Date();
        cy.visit("/");
        cy.contains("View Month").click();
        cy.contains("例假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate() + 1}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells")
            .eq(2).click();
        cy.contains("Add/Edit Leave");
        cy.contains("Available Leaves")
            .next()
            .select("慰假 12/01");
        cy.contains("Schedule").click();
        cy.contains("慰假");
        cy.contains(`${today.getMonth() + 1}/${today.getDate() + 1}`)
            .siblings()
            .as("leaveCells");
        cy.get("@leaveCells").eq(2).should("contain", "慰假") 
    });
});
