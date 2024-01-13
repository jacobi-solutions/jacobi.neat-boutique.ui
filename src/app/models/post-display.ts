
import { Post } from '../services/neat-boutique-api.service';
import { AnswerDisplay } from './answer-display';
import { CommentDisplay } from './comment-display';

export class PostDisplay extends Post {
    public expanded: boolean;
    public timeOnly: string;
    public localLastUpdated: string;
    public localCreated: string;
    public elapsedTime: {
        lastUpdated: {
            minutes: number,
        },
        created: {
            minutes: number,
        },
    };
    // overrides
    public selections: AnswerDisplay[];
    public hasAnswered: boolean;
    public comments: CommentDisplay[];

    constructor(post: Post) {
        super(post);
        this.elapsedTime = {lastUpdated: {minutes: null}, created: {minutes: null}};

        if(this.selections) {
            this.selections = this.selections.map(x => new AnswerDisplay(x, post.postType)).sort(this.sortAnswers);
        }

        if(this.comments) {
            this.comments = this.comments.map(x => new CommentDisplay(x))
        }

        this._getElapsedTime();
        this._setLocalTimeFromUtc();        
    }

    private _getElapsedTime() {
        const now = new Date();
        const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);

        const dateLastUpdated = new Date(this.lastUpdatedDateUtc);
        const dateCreated = new Date(this.createdDateUtc);
        
        this.elapsedTime.created.minutes = Math.floor((utcNow - dateCreated.getTime()) / 60000);
        this.elapsedTime.lastUpdated.minutes = Math.floor((utcNow - dateLastUpdated.getTime()) / 60000);
    }

    private sortAnswers(answerA: AnswerDisplay, answerB: AnswerDisplay) {
        // todo LIU: change utils to be a directive so you can get rid of this
        return (answerB.votes.length - answerA.votes.length);
    }

    private _setLocalTimeFromUtc() {
        const localLastUpdated = new Date(this.lastUpdatedDateUtc);
        const localCreated = new Date(this.createdDateUtc);
        this.localLastUpdated = localLastUpdated.toLocaleString();
        this.localCreated = localCreated.toLocaleString();
    }
}
