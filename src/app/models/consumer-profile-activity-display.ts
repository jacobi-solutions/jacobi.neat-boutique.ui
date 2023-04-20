import { AnswerDisplay } from "./answer-display";
import { ConsumerPostDisplay } from "./consumer-post-display";
import { ReviewDisplay } from "./review-display";

export class ConsumerProfileActivityDisplay {
    questionsAskedCount: number;
    questionsAnsweredCount: number;
    reviewsCount: number;
    recentQuestions: ConsumerPostDisplay[];
    recentAnswers: ConsumerPostDisplay[];
    recentReviews: ReviewDisplay[];

}