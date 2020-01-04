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
        const tomorrow = moment().add(1, "days");
        cy.visit('/');
        cy.contains('Admin').click();
        cy.contains('Test personnel 1').siblings().within(() => {
            cy.contains('Edit Leaves').click();
        });
        cy.contains("Add Leave").click();
        cy.contains("Leave Type").next().select("公假");
        cy.contains("Scheduled Date").next().type(tomorrow.format('YYYY-MM-DD'));
        cy.contains("Duration").next().type("24");
        cy.contains("Submit").click();
        cy.contains("Add Leave");
    });
    it("Admin cannot add a leave with a scheduled date that is already taken", () => {
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
        cy.contains("A leave is already scheduled on this date!");
    });
    it("Admin can edit a leave", () => {
        const tomorrow = moment().add(1, "days");
        cy.visit('/');
        cy.contains('Admin').click();
        cy.contains('Test personnel 2').siblings().within(() => {
            cy.contains('Edit Leaves').click();
        });
        cy.contains("2019/11/05").siblings().within(() => {
            cy.contains("Edit Leave").click();
        });
        cy.contains("Original Date").next().type(tomorrow.format('YYYY-MM-DD'));
        cy.contains("Scheduled Date").next().type(tomorrow.format('YYYY-MM-DD'));
        cy.contains('Duration').next().clear().type('12');
        cy.contains('Submit').click();
        cy.contains("Add Leave");
    });
    it("Admin cannot edit an existing leave to have a scheduled date that is taken", () => {
        const today = moment();
        const dayAfterTmr = moment().add(2, "days");
        cy.visit('/');
        cy.contains('Admin').click();
        cy.contains('Test personnel 2').siblings().within(() => {
            cy.contains('Edit Leaves').click();
        });
        cy.contains('Add Leave').click();
        cy.contains("Leave Type").next().select("公假");
        cy.contains("Scheduled Date").next().type(dayAfterTmr.format('YYYY-MM-DD'));
        cy.contains("Duration").next().type("24");
        cy.contains("Submit").click();

        cy.contains("公假").siblings().within(() => {
            cy.contains("Edit Leave").click();
        });
        cy.contains("Scheduled Date").next().type(today.format('YYYY-MM-DD'));
        cy.contains('Duration').next().clear().type('12');
        cy.contains('Submit').click();
        cy.contains("A leave is already scheduled on this date!");
    });
    it("Admin can delete an existing leave", () => {
        cy.visit('/');
        cy.contains('Admin').click();
        cy.contains('Test personnel 2').siblings().within(() => {
            cy.contains('Edit Leaves').click();
        });

        cy.contains("公假").siblings().within(() => {
            cy.contains("Delete Leave").click();
        });
        cy.contains("公假").should('not.be.visible');
    });
})