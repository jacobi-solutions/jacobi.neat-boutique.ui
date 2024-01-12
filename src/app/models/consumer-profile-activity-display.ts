import { AnswerDisplay } from "./answer-display";
import { PostDisplay } from "./post-display";
import { ReviewDisplay } from "./review-display";

export class ConsumerProfileActivityDisplay {
    questionsAskedCount: number;
    questionsAnsweredCount: number;
    reviewsCount: number;
    recentQuestions: PostDisplay[];
    recentAnswers: PostDisplay[];
    recentReviews: ReviewDisplay[];

}