
import { VendorPost } from "../services/neat-boutique-api.service";
import { CommentDisplay } from "./comment-display";
import { AnswerDisplay } from "./answer-display";

export class VendorPostDisplay extends VendorPost {
    public expanded: boolean;
    public timeOnly: string;
    public localLastUpdated: string;
    public localCreated: string;
    // overrides
    public answers: AnswerDisplay[];
    public comments: CommentDisplay[];

    public hasAnswered: boolean;

    constructor(post: VendorPost) {
        super(post);

        if(this.answers) {
            this.answers = this.answers.map(x => {
                const answer = new AnswerDisplay(x, post.postType);
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

    private _sortAnswers(answerA: AnswerDisplay, answerB: AnswerDisplay) {
        return (answerB.points - answerA.points);
    }
}