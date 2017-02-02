import { Utils } from "smallstack";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-createCompetition" : function(params: {competitionName: string, competitionType: string}){
		Utils.check(params.competitionName, String, "competitionName");
		Utils.check(params.competitionType, String, "competitionType");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type Competition or thow a new Meteor.Error in this method!
	}
});
