import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Platform } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { CategoryDisplay, CategoryService } from 'src/app/services/category.service';
import { NbRoutingService } from 'src/app/services/nb-routing.service';
import { HeroAd } from 'src/app/services/neat-boutique-api.service';
import { PromptComponent } from './prompt/prompt.component';
import { PostDisplay } from 'src/app/models/post-display';
import { UtilService } from 'src/app/services/util.service';
import { VendorService } from 'src/app/vendor.service';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ReviewDisplay } from 'src/app/models/review-display';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  
  @ViewChild('questionPrompt', { read: PromptComponent }) questionPrompt: PromptComponent;
  @ViewChild('answerPrompt', { read: PromptComponent }) answerPrompt: PromptComponent;
  @ViewChild('vendorPrompt', { read: PromptComponent }) vendorPrompt: PromptComponent;
  @ViewChild('reviewPrompt1', { read: PromptComponent }) reviewPrompt1: PromptComponent;
  @ViewChild('reviewPrompt2', { read: PromptComponent }) reviewPrompt2: PromptComponent;
  @ViewChild('reviewPrompt3', { read: PromptComponent }) reviewPrompt3: PromptComponent;
  public promoteMyBusinessLabel = '';
  public prompts: HeroAd[];
  // public showNbHeader2: boolean;
  // public showNbHeader3: boolean;
  // public selectedPageName: string;
  public promptInteraction: boolean;
  public reviewInteraction: boolean;
  // private beginSliding: boolean;

  public categories: Category[];
  public pageName = 'Home';
  public consumerPromptPosts: PostDisplay[];
  public currentPromptPost: PostDisplay;
  public vendorPromptProfiles: VendorDisplay[];
  public currentPromptVendor: VendorDisplay;
  public reviews: ReviewDisplay[];
  public review1: ReviewDisplay;
  public review2: ReviewDisplay;
  public review3: ReviewDisplay;
  public reviewsAreSliding: boolean;
  public currentReviewIndex = 0;
  public currentPromptIndex = 0;
  public mainPromptsAreSliding: boolean;
  public currentUser: CurrentUserDisplay;
  constructor(private _nbRouter: NbRoutingService, private _categoryService: CategoryService, 
    private _animationCtrl: AnimationController, private _util: UtilService, private _router: Router, 
    private _vendorService: VendorService, private _accountService: AccountsService, private _consumerService: ConsumerService,
    private _platform: Platform) {
    
    var postsPromise = new Promise<void>((resolve, reject) => {
      this._categoryService.categoryDisplaySubject.subscribe((categoryDisplay: CategoryDisplay) => {
        if(categoryDisplay) {
          if(categoryDisplay.consumerPosts) {
            this.consumerPromptPosts = [...categoryDisplay.consumerPosts];// .sort(this._util.sortByAnswersCountAsc);
            this.currentPromptPost = this.consumerPromptPosts[this.currentPromptIndex];
            resolve();
          }
        }
      });
    });
    
    var vendorsPromise = new Promise<void>((resolve, reject) => {
      this._vendorService.getVendorsForVendorPrompt().then((vedorProfiles: VendorDisplay[]) => {
        if(vedorProfiles) {
          this.vendorPromptProfiles = vedorProfiles;
          this.currentPromptVendor = this.vendorPromptProfiles[this.currentPromptIndex];
          resolve();
        }
      });
    });

    // Promise.all([postsPromise, vendorsPromise]).then(() => this.beginSlidingMainPrompts());

    if (!this._platform.is("capacitor")) {
      this._accountService.currentUserSubject.subscribe((user) => {
        if(user) {
          this.currentUser = user;
          
          
          if(this.currentUser?.vendor) {
            this.promoteMyBusinessLabel = 'Manage My Business';
          } else {
            this.promoteMyBusinessLabel = 'Promote My Business';
          }
          
          // if(this.currentUser?.vendors?.length > 1) {
          //   this.promoteMyBusinessLabel = 'Manage My Businesses';
          // }
        }
      });
    }
    
    
    this._consumerService.getReviewsForPrompt().then((reviews: ReviewDisplay[]) => {
      if(reviews) {
        this.reviews = reviews;
        this.review1 = this.reviews[this.currentReviewIndex];
        this.review2 = this.reviews[++this.currentReviewIndex];
        this.review3 = this.reviews[++this.currentReviewIndex];
        // this.beginSlidingReviews();
      }
    });
  }
 
  async ngAfterViewInit() {
   
  }

  
  
  

  async beginSlidingMainPrompts() {
    while (!this.promptInteraction) {
      await this.slidePrompts();
      this.currentPromptIndex++;
      // this.currentPromptPost = this.consumerPromptPosts[(this.currentPromptIndex) % this.consumerPromptPosts.length];
      // this.currentPromptVendor = this.vendorPromptProfiles[(this.currentPromptIndex) % this.vendorPromptProfiles.length];
    }  
  }

  async beginSlidingReviews() {
    while (!this.reviewInteraction) {
      await this.slideReviews();
    }  
  }

    
  goToCategoryPage() {
    this.promptInteraction = false;
    this._router.navigateByUrl('/feed', { replaceUrl: true });
  }

  goToBrowsePage() {
    this._router.navigateByUrl('/browse', { replaceUrl: true });
  }
  
  setPromptInteraction() {
    if(!this.mainPromptsAreSliding) {
      this.promptInteraction = true;
    }
  }

  setReviewsInteraction() {
    if(!this.reviewsAreSliding) {
      this.reviewInteraction = true;
    }
  }

  promoteMyBusiness() {
    
    
    if(this.currentUser?.vendor) {
      this._router.navigateByUrl('/vendor-settings', { state: this.currentUser?.vendor });
    } 
    else {
      this._router.navigateByUrl('/pricing');
    }  
    
    // else if(this.currentUser?.vendors?.length > 1) {
    //   this._router.navigateByUrl('/vendor-businesses');
    // }
  }
  

  
  
  async slidePrompts() {
    const delay = 5000;
    const duration =  1500;

    const promise = new Promise<void>(async (resolve, reject) => {
      const promptElements = [ this.questionPrompt, this.answerPrompt, this.vendorPrompt ];
     
      
      await new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
          if(!this.promptInteraction) {
            this.mainPromptsAreSliding = true;
            this.currentPromptPost = this.consumerPromptPosts[(this.currentPromptIndex) % this.consumerPromptPosts.length];
            this._animationCtrl.create()
              .addElement(promptElements[0].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(0)', 'translateX(100vw)').play();
          
            await this._animationCtrl.create()
              .addElement(promptElements[1].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-200vw)', 'translateX(-100vw)').play();
            this.mainPromptsAreSliding = false;
          }
          resolve();
        }, delay);
      });

      
      await new Promise<void>((resolve, reject) => { 
        setTimeout(async () => {
          if(!this.promptInteraction) {
            this.currentPromptVendor = this.vendorPromptProfiles[(this.currentPromptIndex) % this.vendorPromptProfiles.length];
            this.mainPromptsAreSliding = true;
            this._animationCtrl.create()
              .addElement(promptElements[1].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-100vw)', 'translateX(0)').play();
              if(this.promptInteraction) return;
            await this._animationCtrl.create()
              .addElement(promptElements[2].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-300vw)', 'translateX(-200vw)').play();
              this.currentPromptPost = null;
            this.mainPromptsAreSliding = false;
          }
          resolve();
        }, delay);
      });


      
      await new Promise<void>((resolve, reject) => { 
        setTimeout(async () => {
          if(!this.promptInteraction) {
            this.mainPromptsAreSliding = true;
            this._animationCtrl.create()
              .addElement(promptElements[2].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-200vw)', 'translateX(-100vw)').play();

            await this._animationCtrl.create()
              .addElement(promptElements[0].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-100vw)', 'translateX(0)').play();
            this.currentPromptVendor = null
            this.mainPromptsAreSliding = false;
          }
          resolve();
        }, delay);  

      });

      resolve();
    });
    return promise;
  }

  // this is a little dumb. all this 'review1, review2, review3' junk is so that i can reuse the 3 slider logic here.... maybe make it better one day?
  async slideReviews() {
    const delay = 5000;
    const duration =  1500;
    const promise = new Promise<void>(async (resolve, reject) => {
      const promptElements = [ this.reviewPrompt1, this.reviewPrompt2, this.reviewPrompt3 ];
     
      
      await new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
          if(!this.reviewInteraction) {
            this.reviewsAreSliding = true;
            // this.currentPromptPost = this.consumerPromptPosts[(this.currentPromptIndex) % this.consumerPromptPosts.length];
            this._animationCtrl.create()
              .addElement(promptElements[0].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(0)', 'translateX(100vw)').play();
          
            await this._animationCtrl.create()
              .addElement(promptElements[1].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-200vw)', 'translateX(-100vw)').play();
            this.reviewsAreSliding = false;
          }
          resolve();
        }, delay);
      });

      this.review1 = this.reviews[(++this.currentReviewIndex) % this.reviews.length];
      
      await new Promise<void>((resolve, reject) => { 
        setTimeout(async () => {
          if(!this.reviewInteraction) {
            // this.currentPromptVendor = this.vendorPromptProfiles[(this.currentPromptIndex) % this.vendorPromptProfiles.length];
            this.reviewsAreSliding = true;
            this._animationCtrl.create()
              .addElement(promptElements[1].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-100vw)', 'translateX(0)').play();
              if(this.promptInteraction) return;
            await this._animationCtrl.create()
              .addElement(promptElements[2].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-300vw)', 'translateX(-200vw)').play();
              // this.currentPromptPost = null;
            this.reviewsAreSliding = false;
          }
          resolve();
        }, delay);
      });

      this.review2 = this.reviews[(++this.currentReviewIndex) % this.reviews.length];

      await new Promise<void>((resolve, reject) => { 
        setTimeout(async () => {
          if(!this.reviewInteraction) {
            this.reviewsAreSliding = true;
            this._animationCtrl.create()
              .addElement(promptElements[2].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-200vw)', 'translateX(-100vw)').play();

            await this._animationCtrl.create()
              .addElement(promptElements[0].slidingPrompt.nativeElement)
              .duration(duration)
              .iterations(1)
              .fromTo('transform', 'translateX(-100vw)', 'translateX(0)').play();
            // this.currentPromptVendor = null
            this.reviewsAreSliding = false;
          }
          resolve();
        }, delay);  
      });

      this.review3 = this.reviews[(++this.currentReviewIndex) % this.reviews.length];
      resolve();
    });
    return promise;
  }

}
