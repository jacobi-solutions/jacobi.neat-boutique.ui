import { AnswerDisplay } from "./answer-display";
import { PostDisplay } from "./post-display";
import { ReviewDisplay } from "./review-display";
import { CheckInDisplay } from "./check-in-display";

export class ConsumerProfileActivityDisplay {
    questionsAskedCount: number;
    questionsAnsweredCount: number;
    reviewsCount: number;
    checkInsCount: number;
    recentQuestions: PostDisplay[];
    recentAnswers: PostDisplay[];
    recentReviews: ReviewDisplay[];
    recentCheckIns: CheckInDisplay[];

}