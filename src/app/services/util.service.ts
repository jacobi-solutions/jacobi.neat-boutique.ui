import { Injectable } from "@angular/core";
import { AnswerDisplay } from "../models/answer-display";
import { Selection } from "./neat-boutique-api.service";
import { TopUserDisplay } from "../models/top-user-display";

@Injectable({
  providedIn: "root",
})
export class UtilService {

  constructor() {}

  public randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  public sortByCreatedDateUtc(modelA: any, modelB: any) {
      const aDate = new Date(modelA.createdDateUtc);
      const bDate = new Date(modelB.createdDateUtc);
      if ( aDate > bDate ){
        return -1;
      }
      if ( aDate < bDate ){
        return 1;
      }
      return 0;
  }


  public sortByAnswersCountAsc(modelA: any, modelB: any) {
    const aAnswersCount = modelA.selections.length;
    const baAnswersCount = modelB.selections.length;
    if ( aAnswersCount < baAnswersCount ){
      return -1;
    }
    if ( aAnswersCount > baAnswersCount ){
      return 1;
    }
    return 0;
  }

  public sortByLastUpdatedDateUtc(modelA: any, modelB: any) {
      const aDate = new Date(modelA.lastUpdatedDateUtc);
      const bDate = new Date(modelB.lastUpdatedDateUtc);
      if ( aDate > bDate ){
        return 1;
      }
      if ( aDate < bDate ){
        return -1;
      }
      return 0;
  }

  public uniqueStr(stringLength: number=32) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // _-$#@!?
    var charactersLength = characters.length;
    for (var i = 0; i < stringLength; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  // used to normalize given domain to a set range
  public normalizedAnswersForChartMinMax(answers: AnswerDisplay[], rangeMax: number = 100) {    
    let displayAnswers = answers || [];

    if(answers?.length > 1) {
      const points = [...displayAnswers?.map(answer => answer.points)];
      const originalMin = Math.min(...points);
      const originalMax = Math.max(...points);
      const rangeMin = originalMin / originalMax * 100;

      displayAnswers.forEach(answer => {
        if(originalMin !== originalMax && rangeMin !== rangeMax) {
          answer.barChartValue = ((answer.points - originalMin) / (originalMax - originalMin) * (rangeMax - rangeMin)) + rangeMin;
        } else {
          answer.barChartValue = rangeMax;
        }
      });
    }
    return (displayAnswers?.sort(this.sortByPointTotals));
  }

  public normalizedTopUsersForChartMinMax(topUsers: TopUserDisplay[], rangeMax: number = 100) {    
    let displayTopUsers = topUsers || [];

    if(topUsers?.length > 1) {
      const points = [...displayTopUsers?.map(topUser => topUser.points)];
      const originalMin = Math.min(...points);
      const originalMax = Math.max(...points);
      const rangeMin = originalMin / originalMax * 100;

      displayTopUsers.forEach(topUser => {
        if(originalMin !== originalMax && rangeMin !== rangeMax) {
          topUser.barChartValue = ((topUser.points - originalMin) / (originalMax - originalMin) * (rangeMax - rangeMin)) + rangeMin;
        } else {
          topUser.barChartValue = rangeMax;
        }
        
      });
    }
    return (displayTopUsers?.sort(this.sortByPointTotals));
  }

  

  // todo: LIU ... this probably isn't the best way. just got something working
  public sortByPointTotals(modelA: any, modelB: any) {
    return (modelB.points - modelA.points);
    
  //   if ( modelA.voteTotal > modelB.voteTotal ){
  //     return -1;
  //   }
  //   if ( modelA.voteTotal < modelB.voteTotal ){
  //     return 1;
  //   }
  //   return 0;
  }
}
