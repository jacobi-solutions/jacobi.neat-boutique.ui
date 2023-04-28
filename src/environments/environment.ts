// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // neatBoutiqueApiBaseUrl: 'http://localhost',
  neatBoutiqueApiBaseUrl: 'https://neat-boutique-api-ot6bwzgzjq-ue.a.run.app',
  neatBoutiqueUIBaseUrl: 'http://localhost:8101',
  googleCloudStorageBaseUrl: 'https://storage.googleapis.com/neatboutique.com/images/',
  recaptchaSiteKey: '',

  firebaseConfig : {
    apiKey: "AIzaSyDiUhrgtpbuAoqr_QrWqrWP0pv2kYQx5sw",
    authDomain: "neat-boutique.firebaseapp.com",
    projectId: "neat-boutique",
    storageBucket: "neat-boutique.appspot.com",
    messagingSenderId: "801710531417",
    appId: "1:801710531417:web:6f3ffcd1723087058f6248"
  },

  vendorSubscriptionStandardStripePriceId: "price_1LUzlFIuBnHBFjIosHRQpWj6",
  vendorSubscriptionPremiumStripePriceId : "price_1LUzlzIuBnHBFjIo3tJpJP3n",

  appleAppstoreListingUrl: "https://apps.apple.com/us/app/neat-boutique/id1627565588",
  googlePlayListingUrl: "https://play.google.com/store/apps/details?id=ui.neatboutique.jacobi"
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
