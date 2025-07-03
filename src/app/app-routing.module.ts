import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeaderGuard } from './guards/header.guard';
import { ConsumerGuard as ConsumerOnlyGuard } from './guards/consumer.guard';
import { VendorGuard as VendorOnlyGuard } from './guards/vendor.guard';
import { AdminGuard } from './guards/admin.guard';
import { AuthFlowPageModule } from './auth/auth-flow/auth-flow.module';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Home', showMarquee: true, showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'browse',
    loadChildren: () => import('./pages/browse/browse.module').then( m => m.BrowsePageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Browse', showMarquee: true, showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'feed/:postId',
    loadChildren: () => import('./pages/feed/feed.module').then( m => m.CategoryPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Feed', showNbHeader2: true, showNbHeader3: false }
  },
  {
    path: 'feed',
    loadChildren: () => import('./pages/feed/feed.module').then( m => m.CategoryPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Feed', showNbHeader2: true, showNbHeader3: false }
  },
  {
    path: 'routes',
    loadChildren: () => import('./pages/routes/routes.module').then( m => m.RoutesPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Routes', showNbHeader2: true, showNbHeader3: false }
  },
  {
    path: 'vendor-profile/:vendorPath',
    loadChildren: () => import('./pages/vendor-profile/vendor-profile.module').then( m => m.VendorProfilePageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Vendor Profile', showNbHeader2: true, showNbHeader3: true }
  },

  {
    path: 'vendor-list/:categoryName',
    loadChildren: () => import('./pages/vendor-list/vendor-list.module').then( m => m.VendorListPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Vendors', showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'auth-flow',
    // loadChildren: () => import('./auth/auth-flow/auth-flow.module').then( m => m.AuthFlowPageModule),
    loadChildren: () => AuthFlowPageModule,
    canActivate: [ HeaderGuard ],
    data: { title: '' }
  },
  {
    path: 'vendor-connect',
    loadChildren: () => import('./pages/vendor-connect/vendor-connect.module').then( m => m.VendorConnectPageModule),
    canActivate: [ AuthGuard, HeaderGuard ],
    data: { redirect: '/vendor-settings', title: 'Vendor Connect' }
  },
  {
    path: 'vendor-revise',
    loadChildren: () => import('./pages/vendor-revise/vendor-revise.module').then( m => m.VendorRevisePageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/pricing', title: 'Vendor Revise' }
  },
  // {
  //   path: 'my-list',
  //   loadChildren: () => import('./pages/consumer-profile/my-list/my-list.module').then( m => m.MyListPageModule),
  //   canActivate: [ AuthGuard, HeaderGuard ],
  //   data: { title: 'My List', showNbHeader2: true, showNbHeader3: true }
  // },
  {
    path: 'vendor-settings',
    loadChildren: () => import('./pages/vendor-settings/vendor-settings.module').then( m => m.VendorSettingsPageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/pricing', title: 'Vendor Settings', showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'vendor-businesses',
    loadChildren: () => import('./pages/vendor-businesses/vendor-businesses.module').then( m => m.VendorBusinessesPageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/pricing', title: 'Vendor Settings', showNbHeader2: true, showNbHeader3: true }
  },
  // {
  //   path: 'my-questions',
  //   loadChildren: () => import('./pages/my-questions/my-questions.module').then( m => m.MyQuestionsPageModule),
  //   canActivate: [ AuthGuard, HeaderGuard ],
  //   data: { title: 'My Questions', showNbHeader2: true, showNbHeader3: true }
  // },
  {
    path: 'legal',
    loadChildren: () => import('./pages/legal/legal.module').then( m => m.LegalPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Legal', showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'get-started',
    loadChildren: () => import('./pages/get-started/get-started.module').then( m => m.GetStartedPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Get Started', showNbHeader2: true }
  },
  {
    path: 'pricing',
    loadChildren: () => import('./pages/pricing/pricing.module').then( m => m.PricingPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Pricing', showNbHeader2: true }
  },
  {
    path: 'profile/:consumerPath',
    loadChildren: () => import('./pages/consumer-profile/consumer-profile.module').then( m => m.ConsumerProfilePageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Profile', showNbHeader2: true }
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/consumer-settings/consumer-settings.module').then( m => m.ConsumerSettingsPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Settings', showNbHeader2: true }
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    canActivate: [ HeaderGuard ],
    data: { title: 'Contact Us', showNbHeader2: true }
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [ AuthGuard, AdminGuard ],
    data: { redirect: '/home', title: 'Admin' }
  },
  {
    path: 'qr',
    loadChildren: () => import('./pages/qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'network-community',
    loadChildren: () => import('./pages/network-community/network-community.module').then( m => m.NetworkCommunityPageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/home', title: 'Community', showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'network-community/:networkId',
    loadChildren: () => import('./pages/network-community/network-community.module').then( m => m.NetworkCommunityPageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/home', title: 'Community', showNbHeader2: true, showNbHeader3: true }
  },
  {
    path: 'network-community/invite/:inviteId',
    loadChildren: () => import('./pages/network-community/network-community.module').then( m => m.NetworkCommunityPageModule),
    canActivate: [ AuthGuard, VendorOnlyGuard, HeaderGuard ],
    data: { redirect: '/home', title: 'Community', showNbHeader2: true, showNbHeader3: true }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

