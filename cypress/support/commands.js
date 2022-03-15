// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { email, password } from "./credentials";

Cypress.Commands.add("uiLogin", () => {
  cy.visit("http://localhost:3000/auth/login");
  cy.get("input[name=email").type(email);
  cy.get("input[name=password").type(password);
  cy.get("button").click();
});

Cypress.Commands.add("login", () => {
  cy.request("POST", "http://localhost:3090/api/v1/users/login", {
    email,
    password,
  });
});

Cypress.Commands.add("createRfq", () => {
  cy.request("POST", "http://localhost:3090/api/v1/rfqs", {
    eau: 2370000,
    customer_id: 1,
    distributor_id: 1,
    pm_id: 25,
    kam_id: 25,
    final_solutions: "final",
    conclusions: "my thoughts",
    samples_expected: "someday",
    mp_expected: "someday",
    eau_max: 3330000,
  });
});
