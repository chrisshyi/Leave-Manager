/// <reference types="Cypress" />
import { testUserLogin } from "./utils";
import moment from 'moment';
before(() => {
    cy.exec("node dropDB.js");
    cy.exec("node scripts/seedLeaves.js");
    testUserLogin();
});

after(() => {
    cy.exec("node dropDB.js");
    cy.exec("node scripts/seedLeaves.js");
})

beforeEach(() => {
    testUserLogin();
});

describe("Tests the administration of leaves in an organization", () => {
    it("Admin can add a leave for a user", () => {
        const today = moment();
        cy.visit('/');
        cy.contains('Admin').click();
        cy.contains('Test personnel 1').siblings().within(() => {
            cy.contains('Edit Leaves').click();
        });
        cy.contains("Add Leave").click();
        cy.contains("Leave Type").next().select("公假");
        cy.contains("Scheduled Date").next().type(today.format('YYYY-MM-DD'));
        cy.contains("Duration").next().type("24");
        cy.contains("Submit").click();
    });
})