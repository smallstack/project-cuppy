import { Utils } from "@smallstack/core-common";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-placeBet" : function(params: {modelId: string, homeGoals: number, awayGoals: number}){
		Utils.check(params.modelId, "string", "modelId");
		Utils.check(params.homeGoals, "number", "homeGoals");
		Utils.check(params.awayGoals, "number", "awayGoals");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type any or thow a new Meteor.Error in this method!
	}
});
