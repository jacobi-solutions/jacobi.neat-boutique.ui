import { VendorDisplay } from './vendor-display';
import { VendorProfile } from '../services/neat-boutique-api.service';

export class CheckInDisplay {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatarUrl: string;
  vendorAddress: string;
  checkedInDateUtc: Date;
  vendorDisplay: VendorDisplay;

  constructor(data: any) {
    this.id = data.id;
    this.vendorId = data.vendorId;
    this.vendorName = data.vendorName;
    this.vendorAvatarUrl = data.vendorAvatarUrl;
    this.vendorAddress = data.vendorAddress;
    this.checkedInDateUtc = data.checkedInDateUtc ? new Date(data.checkedInDateUtc) : null;

    // Create a minimal VendorProfile object for VendorDisplay
    const vendorProfile = new VendorProfile();
    vendorProfile.id = data.vendorId;
    vendorProfile.name = data.vendorName;
    vendorProfile.avatarSourceURL = data.vendorAvatarUrl;
    vendorProfile.address = data.vendorAddress;
    vendorProfile.reviewCount = 0;
    vendorProfile.reviewRatingTotal = 0;
    vendorProfile.categories = [];

    // Create VendorDisplay from VendorProfile
    this.vendorDisplay = new VendorDisplay(vendorProfile);
  }
}
