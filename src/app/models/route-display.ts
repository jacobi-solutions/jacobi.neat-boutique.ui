import { Post, Route } from '../services/neat-boutique-api.service';
import { PostDisplay } from './post-display';


export class RouteDisplay extends Route {
    constructor(route: Route) {
        super(route);
        this.post = new PostDisplay(route.post);
        this.routeQuestions = this.routeQuestions.map(x => new PostDisplay(x));
    }

    post: PostDisplay;
    routeQuestions?: PostDisplay[];
}
