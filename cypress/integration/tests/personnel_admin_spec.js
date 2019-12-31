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

describe("Tests the administration of personnel in an organization", () => {
    it("Admin can add new personnel", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Add Personnel").click();
        cy.contains("Name").next().type("Cypress User");
        cy.contains("Email").next().type("cypress@gmail.com");
        cy.contains("Password").next().type("123456");
        cy.contains("Role").next().select("Regular User");
        cy.contains("Title").next().type("Mr.");
        cy.contains("Submit").click();
        cy.url().should("equal", "http://localhost:3000/admin");
        cy.contains("Cypress User");
    });
    it("Admin can delete personnel", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Test personnel 0").siblings().eq(3).contains("Delete Personnel").click();
        cy.url().should("equal", "http://localhost:3000/admin");
        cy.contains("Test personnel 0").should('not.visible');
    });
})