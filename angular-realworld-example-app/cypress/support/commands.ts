declare namespace Cypress {
  interface Chainable {
    loginToApplication(): void;
  }
}

Cypress.Commands.add("loginToApplication", () => {
  const userCredential = {
    user: { email: "artem.bondar16@gmail.com", password: "CypressTest1" },
  };

  cy.request({
    method: "POST",
    url: "https://api.realworld.io/api/users/login",
    body: userCredential,
  })
    .its("body")
    .then((body) => {
      const token = body.user.token;
      cy.wrap(token).as("token");
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("jwtToken", token);
        },
      });
    });

  // cy.visit("/login");
  // cy.get('input[formControlName="email"]').type("artem.bondar16@gmail.com");
  // cy.get('input[formControlName="password"]').type("CypressTest1");
  // cy.get("form").submit();
});
