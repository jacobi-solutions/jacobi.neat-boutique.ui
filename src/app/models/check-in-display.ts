import { VendorDisplay } from './vendor-display';
import { VendorProfile } from '../services/neat-boutique-api.service';

export const CheckInTypes = {
  VENDOR: 'Vendor',
  COMMUNITY: 'Community'
};

export class CheckInDisplay {
  id: string;
  type: string; // 'Vendor' or 'Community'

  // Vendor check-in fields
  vendorId: string;
  vendorName: string;
  vendorAvatarUrl: string;
  vendorAddress: string;
  vendorDisplay: VendorDisplay;

  // Community check-in fields
  networkId: string;
  networkName: string;

  checkedInDateUtc: Date;

  constructor(data: any) {
    this.id = data.id;
    this.type = data.type || CheckInTypes.VENDOR;
    this.checkedInDateUtc = data.checkedInDateUtc ? new Date(data.checkedInDateUtc) : null;

    if (this.type === CheckInTypes.VENDOR) {
      this.vendorId = data.vendorId;
      this.vendorName = data.vendorName;
      this.vendorAvatarUrl = data.vendorAvatarUrl;
      this.vendorAddress = data.vendorAddress;

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
    } else if (this.type === CheckInTypes.COMMUNITY) {
      this.networkId = data.networkId;
      this.networkName = data.networkName;
    }
  }
}
