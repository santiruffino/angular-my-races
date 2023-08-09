export const environment = {
  firebase: {
    projectId: 'races-app-534ee',
    appId: import.meta.env['NG_APP_ID'],
    databaseURL: import.meta.env['NG_APP_DATABASE_URL'],
    storageBucket: 'races-app-534ee.appspot.com',
    locationId: 'us-central',
    apiKey: import.meta.env['NG_APP_API_KEY'],
    authDomain: 'races-app-534ee.firebaseapp.com',
    messagingSenderId: import.meta.env['NG_APP_MESSAGING_SENDER_ID'],
    measurementId: import.meta.env['NG_APP_MEASUREMENT_ID'],
  },
  sentryDsn: import.meta.env['NG_APP_SENTRY_DSN'],
  production: true,
};
