import { GooglePlacesEntity } from "../services/neat-boutique-api.service";

export class GooglePlacesEntityDisplay extends GooglePlacesEntity {
    public street: string;
    public city: string;
    public state: string;
    public country: string;
   
    constructor(googleEntity: GooglePlacesEntity) {
        super(googleEntity);

        const [name, street, city, state, country] = this.description.split(',').map(x => x.trim());
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;

    }
};