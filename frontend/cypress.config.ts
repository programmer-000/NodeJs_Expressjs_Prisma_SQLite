// import { defineConfig } from "cypress";
//
// export default defineConfig({
//   projectId: 'cxnhjn',
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//     baseUrl: 'http://localhost:4200'
//   },
// });

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200'
  },
  env: {
    api_server: 'http://localhost:5000',
  }
})
