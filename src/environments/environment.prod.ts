export const environment = {
  firebase: {
    projectId: 'races-app-534ee',
    appId: process.env['NG_APP_ID'],
    databaseURL: process.env['NG_APP_DATABASE_URL'],
    storageBucket: 'races-app-534ee.appspot.com',
    locationId: 'us-central',
    apiKey: process.env['NG_APP_API_KEY'],
    authDomain: 'races-app-534ee.firebaseapp.com',
    messagingSenderId: process.env['NG_APP_MESSAGING_SENDER_ID'],
    measurementId: process.env['NG_APP_MEASUREMENT_ID'],
  },
  production: true,
};
