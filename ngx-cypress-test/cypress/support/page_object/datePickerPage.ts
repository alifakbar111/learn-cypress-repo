function selectDayFromCurrent(day: number) {
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
        selectDayFromCurrent(day);
      } else {
        cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
      }
    });
  return dateAssert;
}
export class DatePickerPage {
  selectDatepickerFromToday(dayFromToday: number) {
    cy.contains("nb-card", "Common Datepicker")
      .find('input[placeholder="Form Picker"]')
      .then((input) => {
        cy.wrap(input).click();
        const dateAssert = selectDayFromCurrent(dayFromToday);
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert);
      });
  }
  selectDatepickerRangeFromToday(firstDay: number, secondDay: number) {
    cy.contains("nb-card", "Datepicker With Range")
      .find('input[placeholder="Range Picker"]')
      .then((input) => {
        cy.wrap(input).click();
        const dateStartAssert = selectDayFromCurrent(firstDay);
        const dateEndAssert = selectDayFromCurrent(secondDay);
        const finalDateRange = `${dateStartAssert} - ${dateEndAssert}`;
        cy.wrap(input)
          .invoke("prop", "value")
          .should("contain", finalDateRange);
        cy.wrap(input).should("have.value", finalDateRange);
      });
  }
}

export const onDatePickerPage = new DatePickerPage();
