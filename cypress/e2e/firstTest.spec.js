/// <reference types="cypress"/>
// identifying cypress in intellisense

const { first } = require("rxjs-compat/operator/first");

describe("Our first suite", () => {
  it("Test - Get web element", () => {
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

  it("Test - Get by unique identifier", () => {
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

  it("Test - Then and wrap method", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //cy.contains("nb-card", "Using the Grid")
    //  .find("[for='inputEmail1']")
    //  .should("contain", "Email");
    //cy.contains("nb-card", "Using the Grid")
    //  .find("[for='inputPassword2']")
    //  .should("contain", "Password");

    //cy.contains("nb-card", "Basic form")
    //  .find("[for='exampleInputEmail1']")
    //  .should("contain", "Email address");
    //cy.contains("nb-card", "Basic form")
    //  .find("[for='exampleInputPassword1']")
    //  .should("contain", "Password");

    // works in selenium but not in cypress
    //
    // const firstForm = cy.contains('nb-card','Using the Grid');
    // firstForm.find('[for='exampleInputEmail1']").should("contain", "Email");
    // firstForm.find("[for='inputPassword2']").should("contain", "Password");

    // better approach, with then method
    // JQuery object works only
    // Assertion = expect (Chai) works with JQuery, should (Cypress) works with Cypress
    // result of contains is stored in firstForm
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      const emailLabelFirst = firstForm.find("[for='inputEmail1']").text();
      const passwordLabelFirst = firstForm
        .find("[for='inputPassword2']")
        .text();
      expect(emailLabelFirst).to.equal("Email");
      expect(passwordLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const emailLabelSecond = secondForm
          .find('[for="exampleInputEmail1"]')
          .text();
        const passwordLabelSecond = secondForm
          .find("[for='exampleInputPassword1']")
          .text();
        //expect(emailLabelSecond).to.equal(emailLabelFirst); FAIL
        expect(passwordLabelSecond).to.equal(passwordLabelFirst);

        // return to cypress object with wrap method
        cy.wrap(secondForm)
          .find("[for='exampleInputPassword1']")
          .should("contain", "Password");
      });
    });
  });

  it("Test - Invoke command 1", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //1 - Get by unique identifier
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");
    //2 - Get by then, jQuery object
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
    });

    //3 - Invoke command
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((label) => {
        expect(label).to.equal("Email address");
      });

    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      //.should("contain", "checked");
      // OR
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  it.only("Test - Invoke command 2", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        cy.get("nb-calendar-day-picker").contains("17").click();
        cy.wrap(input)
          .invoke("prop", "value")
          .should("contain", "Jan 17, 2023");
      });
  });
});
