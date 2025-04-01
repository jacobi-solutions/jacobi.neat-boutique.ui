import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { CustomerDiscount } from 'src/app/services/neat-boutique-api.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { VendorService } from 'src/app/vendor.service';

@Component({
  selector: 'app-customer-discounts',
  templateUrl: './customer-discounts.component.html',
  styleUrls: ['./customer-discounts.component.scss'],
})
export class CustomerDiscountsComponent  implements OnInit {
  @Input() vendor: VendorDisplay;
  discountsForm: FormGroup;

  editDiscounts = false;
  constructor(private _fb: FormBuilder, private _vendorSettings: VendorSettingsService) { 
    
  }

  ngOnInit() {
    this.discountsForm = this._fb.group({
      discountsForLociCustomers: this._fb.array([
       
      ]),
    });
    this.loadInitialDiscounts();
  }

  toggleEditDiscounts() {
    this.editDiscounts = !this.editDiscounts;
  }

  loadInitialDiscounts() {
    const discountsArray = this.discountsForm.get('discountsForLociCustomers') as FormArray;
    while (discountsArray.length !== 0) {
      discountsArray.removeAt(0);
    }
    
    if(this.vendor.generalDiscounts?.length > 0) {
      this.vendor.generalDiscounts.forEach(discount => {
        discountsArray.push(this._fb.group({
          description: [ discount.description || '' ], // Add description here
        }));
      });
    } else {
      discountsArray.push(this._fb.group({
        description: [ '' ], // Add description here
      }));
    }
  }
  
  
  // Getter for Network Discounts Array
  get discountsForLociCustomers() {
    return this.discountsForm.get('discountsForLociCustomers') as FormArray;
  }

  createDiscountGroup(): FormGroup {
    return this._fb.group({
      // visitsThreshold: [1, [Validators.required, Validators.min(1)]], // Must be positive
      // discountType: ['', Validators.required], // String instead of enum
      description: ['', Validators.required], // Can be percentage, fixed amount, etc.
    });
  }
  
  // Add Business Discount
  addDiscountsForLociCustomers() {
    this.discountsForLociCustomers.push(this.createDiscountGroup());
  }
  
  // Remove Business Discount
  removeDiscountsForLociCustomers(index: number) {
    if(this.discountsForLociCustomers.length > 1) {
      this.discountsForLociCustomers.removeAt(index);
    }
  }

  updateDiscounts() {
    console.log(this.discountsForm.value);
    var discounts = this.discountsForm.value.discountsForLociCustomers.map(discount => new CustomerDiscount(discount));
    
    this._vendorSettings.updateVendorCustomerDiscounts(this.vendor.id, discounts).then(vendor => {
      this.vendor = vendor;
      this.toggleEditDiscounts();
    });
  }

}
