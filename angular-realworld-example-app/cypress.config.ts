import { defineConfig } from "cypress";

export default defineConfig({
  // to disabled video result
  // video: false,
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/**/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
