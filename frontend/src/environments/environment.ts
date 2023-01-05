// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://upi-dev.unilever.com/',
  // apiUrl1:"http://localhost:3000",
  apiUrl:"http://localhost:3000",
  // apiUrl:"https://bieno-da22-d-902520-webapi-01.azurewebsites.net",
  azure: {
    clientId: '9046e133-1ebd-42d7-9722-7f4cf50de7b2',
    tenantID: 'f66fae02-5d36-495b-bfe0-78a6ff9f8e6e',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
