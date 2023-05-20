describe("Test with backend", () => {
  beforeEach("login to application", () => {
    cy.intercept(
      {
        method: "GET",
        path: "tags",
      },
      {
        fixture: "tags.json",
      }
    );
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
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.response.body.article.body).to.equal(
        "this is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "this is a description"
      );
    });
  });

  it("intercepting and modifying the request and response", () => {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // cy.intercept("POST", "https://api.realworld.io/api/articles/", (req) => {
    //   req.body.article.description = "this is a description 2";
    // }).as("postArticles");
    cy.intercept("POST", "https://api.realworld.io/api/articles/", (req) => {
      req.reply((res) => {
        expect(res.body.article.description).to.equal("this is a description");
        res.body.article.description = "this is a description 2";
      });
    }).as("postArticles");

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
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.response.body.article.body).to.equal(
        "this is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "this is a description 2"
      );
    });
  });

  it("verify popular tags are displayed", () => {
    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "automation")
      .and("contain", "testing");
  });

  it("varify global feed like count", () => {
    cy.intercept("GET", "https://api.realworld.io/api/articles/feed*", {
      articles: [],
      articlesCount: 0,
    });

    cy.intercept("GET", "https://api.realworld.io/api/articles*", {
      fixture: "articles.json",
    }).as("getGlobalFeed");

    cy.contains("Global Feed").click();
    cy.wait("@getGlobalFeed", {
      timeout: 5000,
    });
    cy.get("app-article-list button").then((heartList) => {
      cy.wait("@getGlobalFeed", {
        timeout: 5000,
      });
      expect(heartList[0]).to.contain("1");
      expect(heartList[1]).to.contain("5");
    });

    cy.fixture("articles.json").then((file) => {
      const articleLink = file.articles[1].slug;
      file.articles[1].favoritesCount = 6;

      cy.intercept(
        "POST",
        `https://api.realworld.io/api/articles/${articleLink}/favorite`,
        file
      );

      cy.get("app-article-list button").eq(1).click().should("contain", "6");
    });
  });

  it("delete new article in a global feed", () => {
    const bodyRequest = {
      article: {
        tagList: [],
        title: "test title 123",
        description: "test about 123",
        body: "test description 123",
      },
    };

    cy.get("@token").then((token) => {
      cy.request({
        method: "POST",
        url: "https://api.realworld.io/api/articles/",
        headers: { Authorization: `Token ${token}` },
        body: bodyRequest,
      }).then((resp) => {
        expect(resp.status).to.equal(200);
      });

      cy.contains("Global Feed").click();
      cy.get(".article-preview").first().click();

      cy.get(".article-actions").contains("Delete Article").click();

      cy.request({
        method: "GET",
        url: "https://api.realworld.io/api/articles?limit=10&offset=0",
        headers: { Authorization: `Token ${token}` },
      })
        .its("body")
        .then((body) => {
          cy.wait(5000);
          expect(body.articles[0].title).not.to.equal("test title 123");
        });
    });
  });
});
