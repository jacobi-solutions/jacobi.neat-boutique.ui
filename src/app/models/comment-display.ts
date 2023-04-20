import { Comment } from "../services/neat-boutique-api.service";

export class CommentDisplay extends Comment  {
    public title: string;
    public subTitle: string;
    public createdBy: string;
    public createdDate: string;
    public localCreated: string;
    public localLastUpdated: string;
    public visited: boolean;
    public source: string;
    public isDeleted: boolean;
    
    constructor(comment) {
        super(comment);

        this._setLocalTimeFromUtc();        
    }


    private _setLocalTimeFromUtc() {
        const localLastUpdated = new Date(this.lastUpdatedDateUtc);
        const localCreated = new Date(this.createdDateUtc);
        this.localLastUpdated = localLastUpdated.toLocaleString();
        this.localCreated = localCreated.toLocaleString();
    }
}
