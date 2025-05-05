import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryType } from 'src/app/services/neat-boutique-api.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-select-categories-modal',
  templateUrl: './select-categories-modal.component.html',
  styleUrls: ['./select-categories-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectCategoriesModalComponent implements OnInit {

  @Input() vendorCategories: CategoryType[] = [];
  public categoryTypes: CategoryType[];
  public categorySet: {};
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _vendorSettings: VendorSettingsService) {
    this.categoryTypes = Object.values(CategoryType);
  }

  ngOnInit() {
    this.categorySet = this.categorySet || {};
    this.categoryTypes.forEach(category => {
      if(!this.categorySet.hasOwnProperty(category)) {
        this.categorySet[category] = {
          isSelected: this.vendorCategories.includes(category),
        };
      }
    });
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  public vendorInCategory(category: CategoryType) {
    return this.vendorCategories.includes(category);
  }

  public assessSelectedCategories(event) {
    const userSelectedCategories = Object.keys(this.categorySet).filter(categoryName => {
      return this.categorySet[categoryName].isSelected;
    })

    if(userSelectedCategories?.length === 0) {
      this.userErrorMsg = 'At least one category needs to be selected.';
    } else {
      this.userErrorMsg = null;
    }
  }

  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      categorySet: null,
      event,
    });
  }

  onSave(event) {
    const categoryArray = Object.keys(this.categorySet)
      .map(comm => {
        if(this.categorySet[comm].isSelected) {
          return comm
        }
        return false
      }).filter(comm => comm);

    if(categoryArray?.length === 0) {
      this._modalController.dismiss({
        dismissed: true,
        categorySet: this.vendorCategories,
        event,
      });
    }

    this._modalController.dismiss({
      dismissed: true,
      categorySet: categoryArray,
      event,
    });

    // this._vendorSettings.updateVendorCategories();

    // updateVendorCategories
  }
}
