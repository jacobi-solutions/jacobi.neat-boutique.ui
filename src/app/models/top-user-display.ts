import { RouteSelectionVisit, RouteTopUser, Selection } from "../services/neat-boutique-api.service";
import { SelectionVoteRankingTypes } from "./constants";
import { EntityDisplay } from "./entity-display";

export class TopUserDisplay extends RouteTopUser {
    public postType: string;
    public barChartValue: number;
    public isDeleted: boolean;
    public entity: EntityDisplay;   
    public points: number; 
    public barColor: string;
    public barWidth: string;
    constructor(topUser: RouteTopUser) {
        super(topUser);
        this.isDeleted = false;

        this.entity = new EntityDisplay(topUser.visitor);
        this.points = this.routeVisits;
    }
}
