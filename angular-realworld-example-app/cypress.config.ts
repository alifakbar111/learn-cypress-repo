import { defineConfig } from "cypress";

export default defineConfig({
  // to disabled video result
  // video: false,

  env: {
    username: "cytest@test.com",
    password: "Welcome123",
    apiUrl: "https://api.realworld.io",
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/**/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME;
      const password = process.env.PASSWORD;

      // if (!password) {
      //   throw new Error("missing PASSWORD environment variable");
      // }

      config.env = { username, password };
      return config;
      // implement node event listeners here
    },
  },
});
