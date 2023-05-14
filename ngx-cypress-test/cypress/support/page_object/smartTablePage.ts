export class SmartTable {
  updateAgeByFirstName(name: string, age: string) {
    cy.get("tbody")
      .contains("tr", name)
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('input[placeholder="Age"]').clear().type(age);
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow)
          .contains("tr", name)
          .then((row) => {
            cy.wrap(row).should("contain", age);
          });
      });
  }

  addNewRecordWithFirstandLastName(fname: string, lname: string) {
    cy.get("thead").find(".nb-plus").click();
    cy.get("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow)
          .find('input[placeholder="First Name"]')
          .clear()
          .type(fname);
        cy.wrap(tableRow)
          .find('input[placeholder="Last Name"]')
          .clear()
          .type(lname);
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((item) => {
        cy.wrap(item).eq(2).should("contain", fname);
        cy.wrap(item).eq(3).should("contain", lname);
      });
  }

  deleteRowByIndex(index: number) {
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .eq(index)
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });
  }
}

export const onSmartTablePage = new SmartTable();
