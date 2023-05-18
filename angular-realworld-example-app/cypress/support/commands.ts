declare namespace Cypress {
  interface Chainable {
    loginToApplication(): void;
  }
}

Cypress.Commands.add("loginToApplication", () => {
  cy.visit("/login");
  cy.get('input[formControlName="email"]').type("artem.bondar16@gmail.com");
  cy.get('input[formControlName="password"]').type("CypressTest1");
  cy.get("form").submit();
});
