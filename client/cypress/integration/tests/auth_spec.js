/// <reference types="Cypress" />
describe("Tests authentication functionality", function() {
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
        cy.contains('Login failure');
    });
});