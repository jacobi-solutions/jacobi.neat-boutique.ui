import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent implements OnInit {
  public pageName = 'Create Community';
  public vendor: VendorDisplay;
  public createCommunityForm: FormGroup;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _networkService: NetworkService
  ) {
    this.vendor = this._router.getCurrentNavigation()?.extras?.state as VendorDisplay;
    
    this.createCommunityForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    if (!this.vendor) {
      this._router.navigate(['/vendor-settings']);
    }
  }

  onSubmit() {
    if (this.createCommunityForm.invalid) {
      return;
    }

    const networkData = this.createCommunityForm.value;
    this._networkService.createNetwork(networkData.name, networkData.description, this.vendor.id).then(
      response => {
        console.log('Network created successfully', response);
        if (response) {
          this._networkService.setCurrentNetwork(response);
          this._router.navigate(['/network-community']);
        }
        // Navigate to another page or show a success message
      },
    );
  }
} 