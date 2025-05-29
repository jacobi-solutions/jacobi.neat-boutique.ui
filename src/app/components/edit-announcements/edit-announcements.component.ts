import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { VendorProfile, GetVendorAnnouncementsRequest, AddVendorAnnouncementRequest, UpdateVendorAnnouncementRequest, DeleteVendorAnnouncementRequest, VendorAnnouncement, NeatBoutiqueApiService } from 'src/app/services/neat-boutique-api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-announcements',
  templateUrl: './edit-announcements.component.html',
  styleUrls: ['./edit-announcements.component.scss'],
})
export class EditAnnouncementsComponent implements OnInit {
  @Input() vendor: VendorProfile;
  
  announcementsForm: FormGroup;
  announcements: VendorAnnouncement[] = [];
  editMode = false;
  loading = false;
  maxAnnouncements = 3;
  maxCharacters = 300;

  constructor(
    private _fb: FormBuilder, 
    private _neatBoutiqueApi: NeatBoutiqueApiService,
    private _toastController: ToastController
  ) { }

  ngOnInit() {
    this.announcementsForm = this._fb.group({
      announcementsList: this._fb.array([])
    });
    this.loadAnnouncements();
  }

  async loadAnnouncements() {
    if (!this.vendor?.id) return;
    
    this.loading = true;
    const request = new GetVendorAnnouncementsRequest();
    request.vendorId = this.vendor.id;

    try {
      this._neatBoutiqueApi.get(request).subscribe(async (response) => {
        this.loading = false;
        if (response.isSuccess && response.announcements) {
          this.announcements = response.announcements;
          this.loadInitialAnnouncements();
        } else {
          await this.showToast('Failed to load announcements', 'danger');
        }
      });
    } catch (error) {
      this.loading = false;
      await this.showToast('Error loading announcements', 'danger');
    }
  }

  loadInitialAnnouncements() {
    const announcementsArray = this.announcementsForm.get('announcementsList') as FormArray;
    
    // Clear existing form controls
    while (announcementsArray.length !== 0) {
      announcementsArray.removeAt(0);
    }
    
    // Add existing announcements to form
    if (this.announcements?.length > 0) {
      this.announcements.forEach(announcement => {
        announcementsArray.push(this._fb.group({
          id: [announcement.id],
          title: [announcement.title || '', [Validators.required, Validators.maxLength(100)]],
          body: [announcement.body || '', [Validators.required, Validators.maxLength(this.maxCharacters)]]
        }));
      });
    } else {
      // Add one empty announcement if none exist
      this.addAnnouncement();
    }
  }

  get announcementsList() {
    return this.announcementsForm.get('announcementsList') as FormArray;
  }

  createAnnouncementGroup(): FormGroup {
    return this._fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      body: ['', [Validators.required, Validators.maxLength(this.maxCharacters)]]
    });
  }

  addAnnouncement() {
    if (this.announcementsList.length < this.maxAnnouncements) {
      this.announcementsList.push(this.createAnnouncementGroup());
    }
  }

  async removeAnnouncement(index: number) {
    const announcementControl = this.announcementsList.at(index);
    const announcementId = announcementControl?.get('id')?.value;

    // If this is an existing announcement (has ID), delete it from the backend
    if (announcementId) {
      try {
        const deleteRequest = new DeleteVendorAnnouncementRequest();
        deleteRequest.id = announcementId;

        this._neatBoutiqueApi.delete(deleteRequest).subscribe(async (response) => {
          if (response.isSuccess) {
            this.announcementsList.removeAt(index);
            await this.showToast('Announcement deleted successfully', 'success');
            this.loadAnnouncements(); // Refresh the list
          } else {
            await this.showToast('Failed to delete announcement', 'danger');
          }
        });
      } catch (error) {
        await this.showToast('Error deleting announcement', 'danger');
      }
    } else {
      // Just remove from form if it's not saved yet
      this.announcementsList.removeAt(index);
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Reset form when canceling
      this.loadInitialAnnouncements();
    }
  }

  async saveAnnouncements() {
    if (!this.announcementsForm.valid) {
      await this.showToast('Please fix all errors before saving', 'warning');
      return;
    }

    this.loading = true;
    const formValues = this.announcementsForm.value.announcementsList;
    
    try {
      for (const announcement of formValues) {
        if (!announcement.title?.trim() || !announcement.body?.trim()) {
          continue; // Skip empty announcements
        }

        if (announcement.id) {
          // Update existing announcement
          const updateRequest = new UpdateVendorAnnouncementRequest();
          updateRequest.id = announcement.id;
          updateRequest.title = announcement.title.trim();
          updateRequest.body = announcement.body.trim();

          this._neatBoutiqueApi.update(updateRequest).subscribe();
        } else {
          // Add new announcement
          const addRequest = new AddVendorAnnouncementRequest();
          addRequest.title = announcement.title.trim();
          addRequest.body = announcement.body.trim();

          this._neatBoutiqueApi.add(addRequest).subscribe();
        }
      }

      // Wait a moment for API calls to complete, then refresh
      setTimeout(async () => {
        this.loading = false;
        this.editMode = false;
        await this.showToast('Announcements saved successfully', 'success');
        this.loadAnnouncements();
      }, 1000);

    } catch (error) {
      this.loading = false;
      await this.showToast('Error saving announcements', 'danger');
    }
  }

  getCharacterCount(index: number): number {
    const control = this.announcementsList.at(index)?.get('body');
    return control?.value?.length || 0;
  }

  canAddMore(): boolean {
    return this.announcementsList.length < this.maxAnnouncements;
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this._toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
} 