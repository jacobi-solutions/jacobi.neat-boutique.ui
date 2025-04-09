
export const environment = {
  
  production: true,
  // lociApiBaseUrl: 'http://localhost',
  lociApiBaseUrl: 'https://api.lociknows.com',
  lociUIBaseUrl: 'https://lociknows.com',
  googleCloudStorageBaseUrl: 'https://storage.googleapis.com/neatboutique.com/images/',
  recaptchaSiteKey: '',

  
  firebase: {
    projectId: 'citric-inkwell-330122',
    appId: '1:529820257802:web:5f48a537442e238a97d9f3',
    storageBucket: "citric-inkwell-330122.firebasestorage.app",
    locationId: 'us-central',
    apiKey: 'AIzaSyBxreSfUWgDYfOT4H8A0pmPnuoeGJiGoxI',
    authDomain: 'citric-inkwell-330122.firebaseapp.com',
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

