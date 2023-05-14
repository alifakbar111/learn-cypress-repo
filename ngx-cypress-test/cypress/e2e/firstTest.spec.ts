/// <reference types="cypress" />

describe("our first test suite", () => {
  it("first test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // by html tag
    cy.get("input");

    // by id
    cy.get("#inputEmail1");

    // by classname
    cy.get(".input-full-width");

    // by attribute name
    cy.get("[placeholder]");

    // by attribute name and value
    cy.get("[placeholder='Email']");

    // by class value
    cy.get("[class='input-full-width size-medium shape-rectangle']");

    // by tag name and attribute with value
    cy.get("input[placeholder='Email']");

    // by two different attribute
    cy.get("[placeholder='Email'][type='email']");

    // by tag name, attribute with value, id and classname
    cy.get("input[placeholder='Email']#inputEmail1.input-full-width");

    // the most recommended way by cypress
    cy.get("[data-cy='imputEmail1']");
  });

  it("second test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get("[data-cy='signInButton']");
    cy.contains("Sign in");
    cy.contains("[status='primary']", "Sign in");

    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    cy.contains("nb-card", "Horizontal form").find(
      "input[type='email']#inputEmail3"
    );
  });

  it("then and wrap method", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // It works but to many line of code
    // cy.contains("nb-card", "Using the Grid")
    //   .find("[for='inputEmail1']")
    //   .should("contain", "Email");

    // cy.contains("nb-card", "Using the Grid")
    //   .find("[for='inputPassword2']")
    //   .should("contain", "Password");

    // cy.contains("nb-card", "Basic form")
    //   .find("[for='exampleInputEmail1']")
    //   .should("contain", "Email address");
    // cy.contains("nb-card", "Basic form")
    //   .find("[for='exampleInputPassword1']")
    //   .should("contain", "Password");

    // another approach
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      const emailLabelFirst = firstForm.find("[for='inputEmail1']").text();
      const passwordLabelFirst = firstForm
        .find("[for='inputPassword2']")
        .text();

      expect(emailLabelFirst).to.equal("Email");
      expect(passwordLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const pwdSecondText = secondForm
          .find("[for='exampleInputPassword1']")
          .text();
        expect(passwordLabelFirst).to.equals(pwdSecondText);

        cy.wrap(secondForm)
          .find("[for='exampleInputPassword1']")
          .should("contain", "Password");
      });
    });
  });

  it("invoke command", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //1
    cy.get("[for='exampleInputEmail1']")
      .should("contain", "Email address")
      .should("have.class", "label")
      .and("have.text", "Email address");

    //2
    cy.get("[for='exampleInputEmail1']").then((label) => {
      expect(label.text()).to.equal("Email address");
      expect(label).to.have.class("label");
      expect(label).to.have.text("Email address");
    });

    //3
    cy.get("[for='exampleInputEmail1']")
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      // .should("contain", "checked");
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  it.only("assert property", () => {
    function selectDayFromContext(day: number) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const futureDay = date.getDate();
      const futureMonth = date.toLocaleString("default", { month: "short" });
      const dateAssert = `${futureMonth} ${futureDay}, ${date.getFullYear()}`;

      cy.get("nb-calendar-navigation")
        .invoke("attr", "ng-reflect-date")
        .then((dateAttribute) => {
          if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click();
            selectDayFromContext(day);
          } else {
            cy.get("nb-calendar-picker [class='day-cell ng-star-inserted']")
              .contains(futureDay)
              .click();
          }
        });
      return dateAssert;
    }

    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find('input[placeholder="Form Picker"]')
      .then((input) => {
        cy.wrap(input).click();
        const dateAssert = selectDayFromContext(100);
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert);
      });

    // cy.contains("nb-card", "Common Datepicker")
    //   .find("input")
    //   .then((datePicker) => {
    //     cy.wrap(datePicker).click();
    //     // cy.get("nb-calendar-day-picker")
    //     //   .find("nb-calendar-day-cell")
    //     //   .get(".today")
    //     //   .click();
    //     cy.get("nb-calendar-picker").contains("10").click();
    //     cy.wrap(datePicker)
    //       .invoke("prop", "value")
    //       .should("contain", "Apr 10, 2023");
    //   });
  });

  it("radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should("be.checked");

        cy.wrap(radioButtons).eq(1).check({ force: true });

        cy.wrap(radioButtons)
          // .first()
          .eq(0)
          .should("not.be.checked");

        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });

  it("checkboxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    cy.get('[type="checkbox"]').check({ force: true });

    cy.get('[type="checkbox"]').eq(0).click({ force: true });
    cy.get('[type="checkbox"]').eq(1).check({ force: true });
  });

  it("list and dropdowns", () => {
    cy.visit("/");

    // first approach
    // cy.get("nav nb-select").click();
    // cy.get(".options-list").contains("Dark").click();
    // cy.get("nav nb-select").should("contain", "Dark");
    // cy.get(".nb-theme-dark nb-layout-header nav").should(
    //   "have.css",
    //   "background-color",
    //   "rgb(34, 43, 69)"
    // );

    // second approach
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((listItem, idx) => {
        const itemText = listItem.text().trim();

        const color = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };

        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          color[itemText]
        );
        if (idx < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });

  it("tables", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // 1
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('input[placeholder="Age"]').clear().type("20");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow)
          .contains("tr", "Larry")
          .then((row) => {
            cy.wrap(row).should("contain", "20");
          });
      });

    //2
    cy.get("thead").find(".nb-plus").click();
    cy.get("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow)
          .find('input[placeholder="First Name"]')
          .clear()
          .type("Alif");
        cy.wrap(tableRow)
          .find('input[placeholder="Last Name"]')
          .clear()
          .type("Akbar");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((item) => {
        cy.wrap(item).eq(2).should("contain", "Alif");
        cy.wrap(item).eq(3).should("contain", "Akbar");
      });

    //3
    const ages = [20, 30, 40, 200];

    cy.wrap(ages).each((age) => {
      cy.get('thead input[placeholder="Age"]').clear().type(`${age}`);
      cy.wait(500);
      cy.get("tbody tr").each((row) => {
        if (`${age}` === "200") {
          cy.wrap(row).should("contain", "No data found");
        } else {
          cy.wrap(row)
            .find("td")
            .last()
            //.eq(6)
            .should("contain", age);
        }
      });
    });
  });

  it("tooltip", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltip").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  it("dialog box", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1
    // cy.get("tbody tr").first().find(".nb-trash").click();

    // cy.on("window:confirm", (confirm) => {
    //   expect(confirm).to.equal("Are you sure you want to delete?");
    // });

    //2
    // const stub = cy.stub();
    // cy.on("window:confirm", stub);
    // cy.get("tbody tr")
    //   .first()
    //   .find(".nb-trash")
    //   .click()
    //   .then(() => {
    //     expect(stub.getCall(0)).to.be.calledWith(
    //       "Are you sure you want to delete?"
    //     );
    //   });

    //3
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", (confirm) => false);
  });
});
