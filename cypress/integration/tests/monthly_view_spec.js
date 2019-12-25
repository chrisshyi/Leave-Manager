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
        cy.contains('例假');
        cy.contains(`${today.getMonth() + 1}/${today.getDate()}`).siblings().as('leaveCells');
        cy.get('@leaveCells').each((value, index, collection) => {
            if (index !== 0) {
                cy.wrap(value).should('contain', '例假');
            }
        });
    });
});
