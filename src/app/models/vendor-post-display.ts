import { PostType } from "typings/custom-types";
import { VendorPost } from "../services/neat-boutique-api.service";
import { CommentDisplay } from "./comment-display";
import { PollAnswerDisplay } from "./poll-answer-display";

export class VendorPostDisplay extends VendorPost {
    public postType: string;
    public expanded: boolean;
    public timeOnly: string;
    public localLastUpdated: string;
    public localCreated: string;
    // overrides
    public answers: PollAnswerDisplay[];
    public comments: CommentDisplay[];

    public hasAnswered: boolean;

    constructor(post: VendorPost) {
        super(post);
        this.postType = PostType.POLL;

        if(this.answers) {
            this.answers = this.answers.map(x => {
                const answer = new PollAnswerDisplay(x);
                answer.postId = this.id;
                return answer;
            }).sort(this._sortAnswers);
        }
        if(this.comments) {
            this.comments = this.comments.map(x => new CommentDisplay(x))
        }

        this._setLocalTimeFromUtc();
    }

    private _setLocalTimeFromUtc() {
        const localLastUpdated = new Date(this.lastUpdatedDateUtc);
        const localCreated = new Date(this.createdDateUtc);
        this.localLastUpdated = localLastUpdated.toLocaleString();
        this.localCreated = localCreated.toLocaleString();
    }

    private _sortAnswers(answerA: PollAnswerDisplay, answerB: PollAnswerDisplay) {
        return (answerB.voteTotal - answerA.voteTotal);
    }
}