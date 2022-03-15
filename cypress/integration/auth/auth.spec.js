/// <reference types="cypress" />

import { email, password } from "../../support/credentials";

describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // sanity check
  it("has a title", () => {
    cy.contains("Riverdi");
    expect(2).to.equal(2);
  });

  it("blocks protected routes", () => {
    // visit protected route
    cy.visit("/rfqs");

    // assert reject message
    cy.contains("you are not logged in");
  });

  it("logs in user", () => {
    // click login
    cy.contains("🔐 Log In").click();

    // assert url
    cy.url().should("include", "login");

    // fill out the form
    cy.get("input[name=email").type(email);
    cy.get("input[name=password").type(password);
    cy.get("button").contains("Log In").click();

    // assert welcome message
    cy.contains("it's really nice to see you");
    cy.contains("💔 Log Out").click();
  });
});
