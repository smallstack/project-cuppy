import { Utils } from "@smallstack/core";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-addTeam" : function(params: {competitionId: string, teamId: string}){
		Utils.check(params.competitionId, "string", "competitionId");
		Utils.check(params.teamId, "string", "teamId");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type boolean or thow a new Meteor.Error in this method!
	}
});
