import { Answer } from "../services/neat-boutique-api.service";
import { AnswerVoteRankingTypes } from "./constants";
import { EntityDisplay } from "./entity-display";

export class AnswerDisplay extends Answer {
    public postType: string;
    public barChartValue: number;
    public isDeleted: boolean;
    public entity: EntityDisplay;    
    public didVoteFor: boolean;
    public points: number = 0;
    constructor(answer: Answer, postType: string) {
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
            if(vote.voteRanking === AnswerVoteRankingTypes.FIRST) {
                this.points += 3;
            }
            if(vote.voteRanking === AnswerVoteRankingTypes.SECOND) {
                this.points += 2;
            }
            if(vote.voteRanking === AnswerVoteRankingTypes.THIRD) {
                this.points += 1;
            }
        });
    }
}
