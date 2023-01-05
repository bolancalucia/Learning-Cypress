/// <reference types="cypress"/>
// identifying cypress in intellisense

describe("Our first suite", () => {
  it("First test", () => {
    // open Cypress base Url defined in config file
    cy.visit("/");
    // get to the page with input web element
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //get any web element
    // Html element used:
    //<input _ngcontent-mxg-c19="" data-cy="imputEmail1"
    //fullwidth="" id="inputEmail1" nbinput="" placeholder="Email"
    //type="email" ng-reflect-full-width="" class="input-full-width size-medium shape-rectangle">

    //get by tag name
    cy.get("input");

    //get by id - add # before
    cy.get("#inputEmail1");

    //get by class name - add . before
    cy.get(".input-full-width");

    //get by attribute name - inside brackets []
    cy.get("[placeholder]");

    //get by attribute value - inside brackets and quotes [""]
    cy.get('[placeholder="Email"]');

    //get by class value - provide entire value from class attribute
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    //get by tag name and attribute with value
    cy.get('input[placeholder="Email"]');

    //get by two different attributes
    cy.get('[placeholder="Email"][fullwidth]');

    //get by tag name, attribute with value, id and class name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    //get by own attribute - most recommended way
    cy.get('[data-cy="imputEmail1"]');
  });

  it("Second test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
    // add new attribute and get button by it
    cy.get("[data-cy='signInButton']");

    // gets only the first matching element, not all elements
    cy.contains("Sign in");
    // more specific search for element with unique identifier
    cy.contains("[status='warning']", "Sign in");
    // get web element by finding sibling with unique identifier and parent
    // get returns all buttons, find returns button only from that section
    // cy.find() works only when we have a parent child elements
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      // assertion
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    cy.contains("nb-card", "Horizontal form").find("[type='email']");
  });

  it.only("Third test", () => {});
});
