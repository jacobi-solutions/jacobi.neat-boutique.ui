// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// // The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   lociApiBaseUrl: 'http://localhost',
//   // lociApiBaseUrl: 'https://neat-boutique-api-ot6bwzgzjq-ue.a.run.app',
//   lociUIBaseUrl: 'http://localhost:8100',
//   googleCloudStorageBaseUrl: 'https://storage.googleapis.com/neatboutique.com/images/',
//   recaptchaSiteKey: '',

//   firebase:  {
//     projectId: "neat-boutique",
//     appId: "1:801710531417:web:6f3ffcd1723087058f6248",
//     storageBucket: "neat-boutique.appspot.com",
//     locationId: 'us-central',
//     apiKey: "AIzaSyDiUhrgtpbuAoqr_QrWqrWP0pv2kYQx5sw",
//     authDomain: "neat-boutique.firebaseapp.com",
//     messagingSenderId: "801710531417",
//     measurementId: "G-CVGLB8YWBX"
//   },

//   googleMapsAPIKey: "AIzaSyCUpbApsq6RKqWDTgdRkOHsHcZb39eBMgM",
  
//   subscriptionGrandfatherStandardStripePriceId: "price_1LmJsLIuBnHBFjIoIuZ0ygek",
//   subscriptionGrandfatherPremiumStripePriceId : "price_1LmJsLIuBnHBFjIoPGSeM1MX",
  
//   subscriptionStandardStripePriceId: "price_1NkqHyIuBnHBFjIonmVuWadI",
//   subscriptionStandardAdditionalBusinessesStripePriceId: "price_1NkqHyIuBnHBFjIodPLjr7BA",
//   subscriptionPremiumStripePriceId : "price_1NkqJXIuBnHBFjIo93bRPhQX",
//   subscriptionPremiumAdditionalBusinessesStripePriceId : "price_1NkqJXIuBnHBFjIoqt8pOIte",
  
//   appleAppstoreListingUrl: "https://apps.apple.com/us/app/neat-boutique/id1627565588",
//   googlePlayListingUrl: "https://play.google.com/store/apps/details?id=ui.neatboutique.jacobi",
//   signInRedirectUrl: '/home',
//   signUpRedirectUrl: '/home',
//   unauthenticatedRedirect: '/auth-flow/sign-in',
//   splitScreenOptions: {
//     images: {
//       signIn: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
//       signUp: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
//     }
//   }
// };








// /*
//  * For easier debugging in development mode, you can import the following file
//  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
//  *
//  * This import should be commented out in production mode because it will have a negative impact
//  * on performance if an error is thrown.
//  */
// // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.




export const environment = {
  
  production: false,
  // lociApiBaseUrl: 'http://localhost',
  lociApiBaseUrl: 'https://api.lociknows.com',
  lociUIBaseUrl: 'https://app.lociknows.com',
  googleCloudStorageBaseUrl: 'https://storage.googleapis.com/neatboutique.com/images/',
  recaptchaSiteKey: '',

  
  firebase: {
    projectId: 'citric-inkwell-330122',
    appId: '1:529820257802:web:5f48a537442e238a97d9f3',
    storageBucket: "citric-inkwell-330122.firebasestorage.app",
    locationId: 'us-central',
    apiKey: 'AIzaSyBxreSfUWgDYfOT4H8A0pmPnuoeGJiGoxI',
    authDomain: 'app.lociknows.com',
    messagingSenderId: '529820257802',
    measurementId: 'G-EFT2LTNEFP',
  },

  googleMapsAPIKey: "AIzaSyCUpbApsq6RKqWDTgdRkOHsHcZb39eBMgM",
  
  subscriptionGrandfatherStandardStripePriceId: "price_1LmJsLIuBnHBFjIoIuZ0ygek",
  subscriptionGrandfatherPremiumStripePriceId : "price_1LmJsLIuBnHBFjIoPGSeM1MX",
  
  subscriptionStandardStripePriceId: "price_1Njl2WIuBnHBFjIoR2lmLYXD",
  subscriptionStandardAdditionalBusinessesStripePriceId: "price_1Njl2WIuBnHBFjIocG26dntj",
  subscriptionPremiumStripePriceId : "price_1Njl7BIuBnHBFjIoSyVvePfI",
  subscriptionPremiumAdditionalBusinessesStripePriceId : "price_1Njl7BIuBnHBFjIo6m9w6NO8",
  
  appleAppstoreListingUrl: "https://apps.apple.com/us/app/neat-boutique/id1627565588",
  googlePlayListingUrl: "https://play.google.com/store/apps/details?id=ui.neatboutique.jacobi",
  signInRedirectUrl: '/home',
  signUpRedirectUrl: '/home',
  unauthenticatedRedirect: '/auth-flow/sign-in',
  splitScreenOptions: {
    images: {
      signIn: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
      signUp: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
    }
  }
};

