import { Utils } from "@smallstack/core-common";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-startCompetition" : function(params: {competitionId: string}){
		Utils.check(params.competitionId, "string", "competitionId");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type boolean or thow a new Meteor.Error in this method!
	}
});
