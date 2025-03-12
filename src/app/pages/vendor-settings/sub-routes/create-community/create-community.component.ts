import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DiscountTypes } from 'src/app/constants/discount-types';
import { VendorNetworkMembershipTypes } from 'src/app/constants/vendor-network-membership-types';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { NetworkResponse, VendorNetworkMembership } from 'src/app/services/neat-boutique-api.service';
import { NetworkService } from 'src/app/services/network.service';

export const CreateCommunityTabTypes = {
  STEP_ONE: "Step one",
  STEP_TWO: "Step two"
}

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent implements OnInit {
  public discountTypes: string[];
    
  public pageName = 'Create Community';
  public vendor: VendorDisplay;
  public createCommunityForm: FormGroup;
  public discountsForm: FormGroup;
  public createCommunityTabTypes = CreateCommunityTabTypes;
  public currentTab: string = CreateCommunityTabTypes.STEP_ONE;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _networkService: NetworkService
  ) {
    this.vendor = this._router.getCurrentNavigation()?.extras?.state as VendorDisplay;
    
    this.createCommunityForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.discountTypes = Object.values(DiscountTypes);

    this.discountsForm = this._fb.group({
      discountsForNetworkMembers: this._fb.array([
        this.createDiscountGroup()
      ]),
    });
  }

  ngOnInit() {
    if (!this.vendor) {
      this._router.navigate(['/vendor-settings']);
    }
  }

  createCommunity() {
    if (this.discountsForm.invalid) {
      this.discountsForm.markAllAsTouched();
    }

    const networkData = this.createCommunityForm.value;
    const discountsData = this.discountsForm.value;
    this._networkService.createNetwork(networkData.name, networkData.description, discountsData.discountsForNetworkMembers, this.vendor.id).then(
      (response: NetworkResponse) => {
        console.log('Network created successfully', response);
        if (response) {
          this._router.navigateByUrl('/network-community', { state: response.network });
        }
        // Navigate to another page or show a success message
      },
    );
  }

  nextStep() {
    if (this.createCommunityForm.invalid) {
      this.createCommunityForm.markAllAsTouched();
    } else {
      this.currentTab = CreateCommunityTabTypes.STEP_TWO;
    }

  }

  previousStep() {
    this.currentTab = CreateCommunityTabTypes.STEP_ONE;
  }

  get discountsForNetworkMembers() {
    return this.discountsForm.get('discountsForNetworkMembers') as FormArray;
  }
  
  

  createDiscountGroup(): FormGroup {
    return this._fb.group({
      // visitsThreshold: [1, [Validators.required, Validators.min(1)]], // Must be positive
      // discountType: ['', Validators.required], // String instead of enum
      description: ['', Validators.required], // Can be percentage, fixed amount, etc.
    });
  }
  
  // Add Business Discount
  AddDiscountsForNetworkMembers() {
    this.discountsForNetworkMembers.push(this.createDiscountGroup());
  }
  
  // Remove Business Discount
  removeDiscountsForNetworkMembers(index: number) {
    if(this.discountsForNetworkMembers.length > 1) {
      this.discountsForNetworkMembers.removeAt(index);
    }
  }
 
  
} 