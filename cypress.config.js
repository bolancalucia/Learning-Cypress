const { defineConfig } = require("cypress");
// destructuring - getting only method defineConfig from cypress package
// naming it the same

// exporting what the defineConfig method returns, parameters are configuration property
module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    setupNodeEvents(on, config) {
      //initPlugin(on, config);
      //on("task", percyHealthCheck);
      //return config;
    },
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
  },
});
