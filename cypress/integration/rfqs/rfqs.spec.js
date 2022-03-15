/// <reference types="cypress" />
import { pmName, email, password } from "../../support/credentials";

describe("RFQs", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("allows logged in user to create new RFQs", () => {
    // Login with custom method
    cy.login();

    // any kind of restricted route!
    cy.visit("/");

    // assert welcome message
    cy.contains("it's really nice to see you");

    // navigate to /rfqs/new
    cy.contains("🎯 New RFQ").click();

    // assert url
    cy.url().should("include", "rfqs/new");

    // fill out the form
    cy.get("input[name=eau").type("25");

    cy.get("select[name=customerId]").select("Monosystem");
    cy.get("select[name=customerId]").should("have.value", 1);

    cy.get("select[name=distributorId]").select("Walter White");
    cy.get("select[name=distributorId]").should("have.value", 1);

    cy.get("select[name=pmId]").select(pmName);
    cy.get("select[name=pmId]").should("have.value", 25);

    cy.get("select[name=kamId]").select(pmName);
    cy.get("select[name=kamId]").should("have.value", 25);

    cy.contains("Add RFQ").click();

    // wait 10 seconds (because sharepoint is slooooow)
    cy.wait(10000);

    // assert url
    cy.url().should("include", "rfqs/");

    // assert partial content
    cy.contains("RVF_RFQ_000001_");
    cy.contains("Walter White");
  });
});
