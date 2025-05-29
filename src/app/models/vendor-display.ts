import { Url } from 'url';
import { NeatBoutiqueEntity, Review, VendorProfile, VendorAnnouncement } from '../services/neat-boutique-api.service';
import { UserRoleTypes } from '../constants/user-role-types';
import { ReviewDisplay } from './review-display';
import { VendorRating } from './vendor-review';

export class VendorDisplay extends VendorProfile {
    public name: string;
    public picture: string;
    public addressDisplay?: Address;
    public formattedAddress: string;
    public phoneFormatted: string;
    public keywordsDisplay?: string[];
    public phoneNumber: string;
    public facebookLink?: string;
    public instagramLink?: string;
    public twitterLink?: string;
    public rating: VendorRating;
    public numberOfReviews: number;
    // public bio: string;
    public reviews: ReviewDisplay[] = [];
    public reviewRatingValues: number[] = [];
    public expandNetworkCard: boolean = false;
    public announcements?: VendorAnnouncement[] = [];
    // public isGooglePlace: boolean;

    constructor(vendor: VendorProfile, reviews?: Review[], announcements?: VendorAnnouncement[]) {
        super(vendor);

        // if(!this.bio) {
        //     this.bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.";
        // }
                
        this._formatAddress();
        this._formatPhoneNumber();
        this._createFullyQualifiedSocialMediaLinks();

        if(reviews && (reviews.length > 0)) {
            this.reviews = reviews.map(review => new ReviewDisplay(review))
        }

        if(announcements && (announcements.length > 0)) {
            this.announcements = announcements;
        }
        
        this.reviewRatingValues = this.reviews.map(review => review.rating); 
    }

    public filterDeletedReviews() {
        const filteredReviews = this.reviews.filter(review => !review.isDeleted);
        const reviewsDeleted = this.reviews.filter(review => review.isDeleted);
        let decreasedRating = 0;
        reviewsDeleted.forEach(review => {
            decreasedRating += review.rating;
        });
        this.reviews = filteredReviews;
        this.reviewCount -= reviewsDeleted.length;
        this.reviewRatingTotal -= decreasedRating;
    }

    private _createFullyQualifiedSocialMediaLinks() {
        if(this.facebookURL && !this.facebookURL.includes('http')) {
            this.facebookLink = `http://${this.facebookURL}`;
        } else {
            this.facebookLink = this.facebookURL;
        }

        if(this.instagramURL && !this.instagramURL.includes('http')) {
            this.instagramLink = `http://${this.instagramURL}`;
        } else {
            this.instagramLink = this.instagramURL;
        }

        if(this.twitterURL && !this.twitterURL.includes('http')) {
            this.twitterLink = `http://${this.twitterURL}`;
        } else {
            this.twitterLink = this.twitterURL;
        }
    }

    // FOR DEV ONLY
    private _getRandomInt(min, max) {
        // min = Math.ceil(min);
        // max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private _formatPhoneNumber() {
        if(!this.phoneNumber) {
            return null;
        }

        const withCountryCode = 11;
        const withoutCountryCode = 10;
        let areaCode: string;
        let exchangeCode: string;
        let subscriberNumber: string;
        const rawNumber = [...this.phoneNumber].filter(n => [...'1234567890'].some(strNum => strNum === n)).join('');
        if(rawNumber.length === withCountryCode) {
            areaCode = rawNumber.substring(1, 4);
            exchangeCode = rawNumber.substring(4, 7);
            subscriberNumber = rawNumber.substring(7);
        } else if(rawNumber.length === withoutCountryCode) {
            areaCode = rawNumber.substring(0, 3);
            exchangeCode = rawNumber.substring(3, 6);
            subscriberNumber = rawNumber.substring(6);
        }
        this.phoneFormatted = `(${areaCode}) ${exchangeCode}-${subscriberNumber}`;
    }

    private _formatAddress(): void {
        let address = '';
        if(this.address) {
            address += this.address
        }
        if(this.city) {
            address += ' '+ this.city;
        }
        if(this.state) {
            address += ', '+ this.state;
        }
        if(this.zip) {
            address += ' '+ this.zip;
        }
        this.formattedAddress = address;
    }
}



export class Address {
    street: string;
    city: string;
    state: string;
    zipCode: number;
}
