import { StringOrNull, VendorProfileOrNull } from "typings/custom-types";
import { ConsumerProfile, VendorProfile } from "../services/neat-boutique-api.service"
import { VendorDisplay } from "./vendor-display";


export class CurrentUserDisplay {
    notificationCategories?: string[];
    feedCategoriesToShow?: string[];
    notificationsForAnsweredQuestions?: boolean;
    public consumer: ConsumerProfile = null;
    public vendor: VendorProfile = null;
    // public vendors: VendorProfile[] = null;
    public ids: string[];
    private _uiVendorsInMyList: string[] = [];
    public isAdmin: boolean = false;

    constructor(consumer: ConsumerProfile, vendor: VendorProfile) {        
        this.consumer = consumer;
        this.vendor = vendor
        this.ids = [];
        if(consumer) {
            this.ids.push(consumer.id);
        }
        if(vendor) {
            this.ids = [...this.ids, ...(vendor.id)];
        }
    }

    
    public addVendorToMyLists(vendor: VendorDisplay) {
        if(!this.consumer.myPlacesVendorIds) {
            this.consumer.myPlacesVendorIds = [];
        }

        const isNotInMyList = ( (this.consumer.myPlacesVendorIds.every(id => id !== vendor.id)) &&
                                (this._uiVendorsInMyList.every(id => id !== vendor.id)));
        if(isNotInMyList) {
            this._uiVendorsInMyList.push(vendor.id);
        }

        this.consumer.myPlacesVendorIds = [...this.consumer.myPlacesVendorIds, ...this._uiVendorsInMyList];
    }

    public removeVendorFromMyPlaces(vendor: VendorDisplay) {
        this._uiVendorsInMyList = this._uiVendorsInMyList.filter(id => id !== vendor.id);
        this.consumer.myPlacesVendorIds = [
            ...this.consumer.myPlacesVendorIds.filter(id => id !== vendor.id),
            ...this._uiVendorsInMyList.filter(id => id !== vendor.id)
        ];
    }

    public hasIdInList(ids: string[]): boolean {   
        var hasId = false;
        for (let id of ids) {
            var hasId = this.hasId(id);
            if(hasId) break;
        }
        
        return hasId;
    }

    public hasId(id: string): boolean { 
        return this.ids.some(x => x === id);
    }

    
    public getMatchingId(queryId: string) {
        return this.ids.find(x => x === queryId);
    }
}