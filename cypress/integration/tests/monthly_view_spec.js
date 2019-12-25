/// <reference types="Cypress" />
import { testUserLogin } from "./utils";


before(() => {
    cy.exec('node scripts/seedLeaves.js');
});

describe("Test users' interaction with the monthly view", () => {
    it("User can view leaves correctly", () => {
        testUserLogin();
        cy.visit("/");
        cy.contains("View Month").click();
        const today = new Date();
        cy.url().should(
            "equal",
            `http://localhost:3000/monthly-view?year=${today.getFullYear()}&month=${today.getMonth() +
                1}`
        );
    });
});
