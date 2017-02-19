import { Utils } from "@smallstack/core";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionRounds-updateRoundDetails" : function(params: {modelId: string, roundName: string, multiplier: number, index: number}){
		Utils.check(params.modelId, "string", "modelId");
		Utils.check(params.roundName, "string", "roundName");
		Utils.check(params.multiplier, "number", "multiplier");
		Utils.check(params.index, "number", "index");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type any or thow a new Meteor.Error in this method!
	}
});
