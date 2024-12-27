import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss'],
})
export class FeedSettingsModalComponent implements OnInit {
  categories: Category[] = [];
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _categoryService: CategoryService) {
   
  }

  ngOnInit() {
    this.categories = this._categoryService.categories;
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

 

  // public assessSelectedCategories(event) {
  //   const userSelectedCategories = Object.keys(this.categorySet).filter(categoryName => {
  //     return this.categorySet[categoryName].isSelected;
  //   })
  // }


  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      event,
    });
  }

  async onSave(event) {
    this._categoryService.updateShownCategories();
    

    this._modalController.dismiss({
      dismissed: true,
      event
    });
  }

}

