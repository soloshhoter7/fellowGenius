// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  agora: {
    appId: '45f3ee50e0fd491aa46bd17c05fc7073',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyCltKxu01z70siY0DplpPBcaTXXL2VCHSQ',
    authDomain: 'fellowgenius-8606c.firebaseapp.com',
    databaseURL: 'https://fellowgenius-8606c.firebaseio.com',
    projectId: 'fellowgenius-8606c',
    storageBucket: 'fellowgenius-8606c.appspot.com',
    messagingSenderId: '284007218397',
    appId: '1:284007218397:web:246d802f5758e9ffcbef34',
    measurementId: 'G-ZDRYSC5RL4',
  },
  //razorpay payment client
  RAZORPAY_KEY_ID: 'rzp_test_B1W7ile7wVdDl1',
  // RAZORPAY_KEY_ID: 'rzp_live_MhUQ4PE6mDs80d',
  
  //backendUrl
  BACKEND_URL: 'http://localhost:8080',
  FRONTEND_PREFIX:'http://localhost:4200/#/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
