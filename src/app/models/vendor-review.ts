export class VendorReview {
    writer: string;
    dateTime: Date;
    subject: string;
    body: string;
    rating: number;
    parted_rating?: VendorRating;

}

export class VendorRating {
    starWhole: number[];
    starHalf: number[];
    starEmpty: number[];
}
