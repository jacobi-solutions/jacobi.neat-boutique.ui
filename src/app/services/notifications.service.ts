import { Injectable, OnInit } from '@angular/core';
import { NeatBoutiqueApiService } from './neat-boutique-api.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { Capacitor } from '@capacitor/core';
import { AccountsService } from './accounts.service';
import { CurrentUserDisplay } from '../models/current-user-display';
import { resolve } from 'dns';
import { ConsumerService } from './consumer.service';
import { on } from 'events';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnInit {
  private _currentUser: CurrentUserDisplay;
  private _hasRegistered: boolean;
  private token: string;
  constructor(private _accountsService: AccountsService, private _router: Router) {
    if(Capacitor.getPlatform() !== 'web') {
      this._accountsService.currentUserSubject.subscribe((currentUser) => {
        if(currentUser && !this._hasRegistered) {
          var hasCategoryNotifications = this._currentUser?.notificationCategories && this._currentUser?.notificationCategories.length > 0;
          if(hasCategoryNotifications || currentUser.notificationsForAnsweredQuestions) {
            this.registerPush().then((token: string) => {
              if(token && token !== '')
                this.token = token;
                this._accountsService.updateNotificationToken(this.token);
            });
          }
        }
      });
    }
   }

  ngOnInit() {
    
  }
  
  public getToken() {

    var promise = new Promise<string>((resolve, reject) =>{
      if(!this.token || this.token === '') {
        this.registerPush().then((token: string) => {
          if(token && token !== '')
          this.token = token
          resolve(this.token);
        });
      } else {
        resolve(this.token);
      }
    });

    return promise;
  }

  registerPush() {
    var promise =  new Promise<string>((resolve, reject) => {
      console.log('Initializing HomePage');
      
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });
  
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: Token) => {
          console.log('Push registration success, token: ' + token.value);
          this._hasRegistered = true;
          resolve(token.value);
        }
  
        
      );
  
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          console.log('Error on registration: ' + JSON.stringify(error));
        }
      );
  
  
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push received: ' + JSON.stringify(notification));
        }
      );
  
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          const data = notification.notification.data;
          console.log('Action performed: ' + JSON.stringify(notification.notification));
          if (data.postId) {
            this._router.navigateByUrl(`/feed/${data.postId}`);
          }
          console.log('Push action performed: ' + JSON.stringify(notification));
        }
      );
      


    });
    

    return promise;
  }
}
