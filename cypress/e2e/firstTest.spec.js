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
    // Text jQuery function is called inside then on a jQuery object
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
    });

    //3 - Invoke command
    // Text jQuery function is called by invoke on a Cypress object
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((label) => {
        expect(label).to.equal("Email address");
      });

    // Invoke calls jQuery function on Cypress object
    // Invoke calls attr function with value class
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

  it("Test - Invoke command 2", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    // Invoke calls prop function with value = value
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

  it("Test - Radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // Force true - element is hidden but we don't care
    // Cypress checks visibility by default
    // first() - Get a first element in an array
    // check() - Checks only unchecked radio button/checkbox as input element
    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should("be.checked");

        // eq(1) - Get a dom element at specific index in an array
        cy.wrap(radioButtons).eq(1).check({ force: true });

        cy.wrap(radioButtons).first().should("not.be.checked");

        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });

  it("Test - Checkboxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('[type="checkbox"]').eq(0).click({ force: true });
  });

  it.only("Test - Dropdown", () => {
    cy.visit("/");
    // 1 - Example with only one element
    // cy.get("nav nb-select").click();
    // cy.get(".options-list").contains("Dark").click();
    // Check color and text are changed
    // cy.get("nav nb-select").should("contain", "Dark");
    // cy.get("nb-layout-header nav").should(
    // "have.css",
    //  "background-color",
    //  "rgb(34, 43, 69)"
    //  );

    // 2 - Example with the whole list
    // each() - goes through list like foreach
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((listItem, index) => {
        // Save text and color
        const itemText = listItem.text().trim();
        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };
        // Iterate and assert every element
        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );
        if (index < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });
});
