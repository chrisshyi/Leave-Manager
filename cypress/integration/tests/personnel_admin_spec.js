/// <reference types="Cypress" />
import { testUserLogin } from "./utils";
import moment from "moment";
before(() => {
    cy.exec("node dropDB.js");
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

    it("Admin can edit personnel name", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Test personnel 1").siblings().eq(1).contains("Edit Personnel").click();
        cy.contains("Name").next().type("2");
        cy.contains("Submit").click();
        cy.url().should("equal", "http://localhost:3000/admin");
        cy.contains("Test personnel 12");
    });
    it("Admin can edit personnel email", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Test personnel 3").siblings().eq(1).contains("Edit Personnel").click();
        cy.contains("Email").next().type("test122@gmail.com");
        cy.contains("Submit").click();
        cy.contains("Logout").click();
        cy.contains("Login").click();
        cy.contains("Email").next().type("test122@gmail.com");
        cy.contains("Password").next().type("blah");
        cy.contains("Submit").click();
        cy.contains("Welcome Test personnel 3");
        cy.contains("Logout");
    })
    it("Admin can edit personnel password", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Test personnel 2").siblings().eq(1).contains("Edit Personnel").click();
        cy.contains("Password").next().type("newPass");
        cy.contains("Submit").click();
        cy.contains("Logout").click();
        cy.contains("Login").click();
        cy.contains("Email").next().type("test2@gmail.com");
        cy.contains("Password").next().type("newPass");
        cy.contains("Submit").click();
        cy.contains("Welcome Test personnel 2");
    });
    it("Admin can edit personnel role", () => {
        cy.visit("/");
        cy.contains("Admin").click();
        cy.contains("Test personnel 4").siblings().eq(1).contains("Edit Personnel").click();
        cy.contains("Role").next().select("HR Administrator");
        cy.contains("Submit").click();
        cy.contains("Logout").click();
        cy.contains("Login").click();
        cy.contains("Email").next().type("test4@gmail.com");
        cy.contains("Password").next().type("blah");
        cy.contains("Submit").click();
        cy.contains("View Month").click();
        cy.contains("Dates").siblings().should("have.length.gte", 3);
    });
})