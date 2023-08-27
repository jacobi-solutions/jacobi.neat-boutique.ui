export class SubscriptionPackage {
    constructor(planTier: string, stripePriceId: string) {
      this.planTier = planTier;
      this.stripePriceId = stripePriceId;
      
    }
    public promoCode: string;
    public stripePriceId: string;
    public planTier: string; 
  
   
  }