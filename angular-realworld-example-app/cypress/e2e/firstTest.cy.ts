describe("Test with backend", () => {
  beforeEach("login to application", () => {
    cy.intercept("GET", "https://api.realworld.io/api/tags", {
      fixture: "tags.json",
    });
    cy.loginToApplication();
  });

  it("verify correct request and response", () => {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    cy.intercept("POST", "https://api.realworld.io/api/articles/").as(
      "postArticles"
    );

    cy.contains("New Article").click();
    cy.get('input[formcontrolname="title"]').type(
      `this is the title-${randomNumber}`
    );
    cy.get('input[formcontrolname="description"]').type(
      "this is a description"
    );
    cy.get('textarea[formcontrolname="body"]').type(
      "this is a body of the article"
    );
    cy.get("button").contains("Publish Article").click();

    cy.wait("@postArticles");

    cy.get("@postArticles").then((xhr: XMLHttpRequest["response"]) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.response.body.article.body).to.equal(
        "this is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "this is a description"
      );
    });
  });

  it.only("verify popular tags are displayed", () => {
    cy.log("we logged in");
  });
});
