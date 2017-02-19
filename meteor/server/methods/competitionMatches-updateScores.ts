import { Utils } from "@smallstack/core";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-updateScores" : function(params: {matchId: string, resultHome: number, resultAway: number}){
		Utils.check(params.matchId, "string", "matchId");
		Utils.check(params.resultHome, "number", "resultHome");
		Utils.check(params.resultAway, "number", "resultAway");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type boolean or thow a new Meteor.Error in this method!
	}
});
