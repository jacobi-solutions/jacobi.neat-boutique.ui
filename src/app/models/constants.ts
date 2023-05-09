/*
::::::::WARNING WARNING WARNING::::::::

        BEWARE THE MAGIC STRINGS
        ANY CHANGE TO THIS OBJECT WILL BREAK THINGS IN THE API!!!
*/

export const CommunityTypes = {
    BOUTIQUES_BEAUTY : "Boutiques & Beauty",
    FOOD_DRINK : "Food & Drink",
    TRAVEL_ADVENTURE : "Travel & Adventure",
    NIGHTLIFE_ENTERTAINMENT : "Nightlife & Entertainment",
    HEALTH_WELLNESS : "Health & Wellness",
    MAINTENANCE_REPAIR : "Maintenance & Repair",
    CHURCH_STATE : "Church & State",
    SERVICES_MORE : "Services & More"
}

export const UserRoleTypes = {
    CONSUMER: "Consumer",
    VENDOR: "Vendor"
}

export const SubscriptionPlanTypes = {
    CONSUMER_BASIC: "basic",
    VENDOR_STANDARD: "standard",
    VENDOR_PREMIUM: "premium"
}

export const AnswerVoteRankingTypes = {
    FIRST: "First",
    SECOND: "Second",
    THIRD: "Third",
    REMOVE: "Remove"
}


export const AnswerVoteRankingColorsMap = new Map([
    ['First', '#c69934'],
    ['Second', '#919191'],
    ['Third', '#825a26'],
]);

export const LociConstants = {
    VERSION_NUMBER: "1.0.6"
}


