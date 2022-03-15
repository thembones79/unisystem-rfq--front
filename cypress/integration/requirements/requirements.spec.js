/// <reference types="cypress" />

import Chance from "chance";

const chance = new Chance();

const requirementText = chance.sentence({ words: 5 });
const noteText = chance.sentence({ words: 10 });

describe("Requirements", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("allows logged in user to add requirement to existing RFQ", () => {
    // Login with custom method
    cy.login();

    // add RFQ with custom method
    cy.createRfq().then((response) => {
      const { id, rfq_code } = response.body;

      // visit newly created RFQ page
      cy.visit(`/rfqs/${id}`);

      // assert that RFQ code is correct
      cy.contains(rfq_code);

      // start adding requirement
      cy.contains("New Requirement").click();

      cy.contains("note");

      // fill out the form

      cy.get("textarea[name=requirement]").type(requirementText);
      cy.get("textarea[name=note]").type(noteText);
      cy.contains("Add Requirement").click();

      // assert that the new requirement exists
      cy.contains(requirementText);
    });
  });
});
