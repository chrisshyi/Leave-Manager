/// <reference types="Cypress" />
before(() => {
    cy.exec("node dropDB.js");
    cy.exec("node scripts/seedLeaves.js");
});

after(() => {
    cy.exec("node dropDB.js");
    cy.exec("node scripts/seedLeaves.js");
})

import { testUserLogin } from './utils';
describe("Test authentication functionality", function() {

    it("User can log in properly", () => {
        cy.visit('/');

        cy.contains('Login').click();

        cy.contains('Email').next().type('testAdmin@gmail.com');
        cy.contains('Password').next().type("123456");

        cy.contains('Submit').click();
        cy.contains("Logout"); // checks that the user is logged in properly
    });
    it("Incorrect credentials prevent the user from logging in", () => {
        
        cy.visit('/');

        cy.contains('Login').click();

        cy.contains('Email').next().type('bogus@yahoo.com');
        cy.contains('Password').next().type("123456");

        cy.contains('Submit').click();
        cy.contains('Invalid credentials');
    });
    it("User can log out properly", () => {
        testUserLogin();
        cy.visit('/');
        cy.contains('Logout').click();
        cy.contains('Login');
        cy.contains('Logout').should('not.visible');
    });
    it("User can create new organization and admin", () => {
        cy.visit('/');
        cy.contains("Sign Up").click();
        cy.contains("Name of Organization").next().type("New Org");
        cy.contains("Email").next().type("newOrgAdmin@gmail.com");
        cy.contains("Password").next().type("123456");
        cy.contains(/^Name$/).next().type("NewOrgAdmin");
        cy.contains("Title").next().type("Blah");
        cy.contains("Submit").click();
        cy.contains("Welcome NewOrgAdmin");
    })
});