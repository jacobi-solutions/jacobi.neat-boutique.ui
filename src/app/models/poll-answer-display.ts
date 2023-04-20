import { NeatBoutiqueApiService, NeatBoutiqueEntity, PollAnswer } from "../services/neat-boutique-api.service";

export class PollAnswerDisplay extends PollAnswer {
    public voteTotal: number;
    public barChartValue: number;
    public isDeleted: boolean;
    public postId: string;
    public points: number = 0;


    public didVoteFor: boolean;
    

    // todo: this is a big indication that something here is DUMB... but this makes things work without rewriting the whole shit
    public votes: PollAnswerVote[] = []; 
    
    constructor(poll: PollAnswer) {
        super(poll);        

        this.isDeleted = false;
        this.voteTotal = (this.voters) ? this.voters?.length : 0;

        this.voters.forEach(x => this.votes.push(new PollAnswerVote(x)));
        this.loadPoints();
    }
    loadPoints() {
        this.points = this.votes.length;
        // this.votes.forEach(vote => {
        //     if(vote.voteRanking === AnswerVoteRankingTypes.FIRST) {
        //         this.points += 3;
        //     }
        //     if(vote.voteRanking === AnswerVoteRankingTypes.SECOND) {
        //         this.points += 2;
        //     }
        //     if(vote.voteRanking === AnswerVoteRankingTypes.THIRD) {
        //         this.points += 1;
        //     }
        // });
    }
}



// todo: this is a big indication that something here is DUMB... but this makes things work without rewriting the whole shit
export class PollAnswerVote {
    constructor(voter: NeatBoutiqueEntity) {
        this.voter = voter;
    }
    voter: NeatBoutiqueEntity;
}