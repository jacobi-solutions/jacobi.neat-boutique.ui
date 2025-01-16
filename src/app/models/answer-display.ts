import { Selection } from "../services/neat-boutique-api.service";
import { SelectionVoteRankingTypes } from "../constants/selection-vote-ranking-types";
import { EntityDisplay } from "./entity-display";

export class AnswerDisplay extends Selection {
    public postType: string;
    public barChartValue: number;
    public isDeleted: boolean;
    public entity: EntityDisplay;    
    public didVoteFor: boolean;
    public points: number = 0;
    constructor(answer: Selection, postType: string) {
        super(answer);
        this.isDeleted = false;
        this.postType = postType;

        if(answer.googlePlace?.placeId) {
            this.entity = new EntityDisplay(answer.googlePlace);
        } else {
            this.entity = new EntityDisplay(answer.vendor);
        }
        this.loadPoints();
    }

    loadPoints() {
        this.votes?.forEach(vote => {
            if(vote.voteRanking === SelectionVoteRankingTypes.FIRST) {
                this.points += 3;
            }
            if(vote.voteRanking === SelectionVoteRankingTypes.SECOND) {
                this.points += 2;
            }
            if(vote.voteRanking === SelectionVoteRankingTypes.THIRD) {
                this.points += 1;
            }
        });
    }
}
