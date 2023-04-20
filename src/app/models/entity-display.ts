import { GooglePlacesEntity, IGooglePlacesEntity, INeatBoutiqueEntity, NeatBoutiqueEntity } from "../services/neat-boutique-api.service";
import { GooglePlacesEntityDisplay } from "./google-entity-display";

export class EntityDisplay implements IGooglePlacesEntity, INeatBoutiqueEntity {
    public placeId?: string | undefined;
    public name?: string | undefined;
    public id?: string | undefined;
    public role?: string | undefined;
    public avatarSourceURL?: string | undefined;
    public isGooglePlaceEntity: boolean
    public description?: string | undefined;
    public street: string | undefined;
    public city: string | undefined;
    public state: string | undefined;
    public country: string | undefined;
    public formattedLocation: string | undefined;
   
    constructor(data?: GooglePlacesEntity | NeatBoutiqueEntity) {
        
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    (<any>this)[property] = (<any>data)[property];
                }    
            }
        }

        this.isGooglePlaceEntity = (data instanceof GooglePlacesEntity);
        if(this.isGooglePlaceEntity) {
            let name = null;
            let street = null;
            let city = null;
            let state = null;
            let country = null;

            const parsedDescription = this.description.split(',').map(x => x.trim());
            if(parsedDescription.length > 4) {
                name = parsedDescription[0];
                street = parsedDescription[1];
                city = parsedDescription[2];
                state = parsedDescription[3];
                country = parsedDescription[4];
            } else {
                street = parsedDescription[0];
                city = parsedDescription[1];
                state = parsedDescription[2];
                country = parsedDescription[3];
            }

            this.street = street;
            this.city = city;
            this.state = state;
            this.country = country;

            if(name) {
                this.name = this.name || name;
                this.formattedLocation = `${street} ${city}, ${state} - ${country}`;
            } else {
                this.formattedLocation = `${street} ${city}, ${state} - ${country}`;
            }
            
        }
    }
};