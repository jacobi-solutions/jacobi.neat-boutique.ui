import { NetworkTopVisitor } from "../services/neat-boutique-api.service";
import { EntityDisplay } from "./entity-display";


export class TopVisitorDisplay extends NetworkTopVisitor {
    public postType: string;
    public barChartValue: number;
    public isDeleted: boolean;
    public entity: EntityDisplay;
    public points: number;
    public barColor: string;
    public barWidth: string;
    constructor(topUser: NetworkTopVisitor) {
        super(topUser);
        this.isDeleted = false;

        this.entity = new EntityDisplay(topUser.visitor);
        this.points = this.networkVisitsCount;
    }
}
