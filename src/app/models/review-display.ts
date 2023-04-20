import { Review } from "../services/neat-boutique-api.service";


export class ReviewDisplay extends Review {

    public isDeleted: boolean = false;
    
    constructor(review: Review) {
        super(review);
    }
}