import { navigateTo } from "./navigationPage";
import { onFormLayoutPage } from "./formLayoutPage";
import { onDatePickerPage } from "./datePickerPage";
import { onSmartTablePage } from "./smartTablePage";

describe("test with page object", () => {
  beforeEach("open application", () => {
    cy.openHomePage();
  });

  it("verify navigation across the pages", () => {
    navigateTo.formLayoutPage();
    navigateTo.datePickerPage();
    navigateTo.smartTablePage();
    navigateTo.toasterPage();
    navigateTo.tooltipPage();
  });

  it.only("should submit inline and basic form and select tomorrow date in the calendar", () => {
    navigateTo.formLayoutPage();
    onFormLayoutPage.submitInlineForm("name test", "test@test.com");
    onFormLayoutPage.submitBasicForm("test@mail.com", "123456");

    navigateTo.datePickerPage();
    onDatePickerPage.selectDatepickerFromToday(2);
    onDatePickerPage.selectDatepickerRangeFromToday(2, 20);

    navigateTo.smartTablePage();
    onSmartTablePage.updateAgeByFirstName("Larry", "20");
    onSmartTablePage.addNewRecordWithFirstandLastName("Alif", "Akbar");
    onSmartTablePage.deleteRowByIndex(2);
  });
});
