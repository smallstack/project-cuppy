import { Utils } from "@smallstack/core";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"devices-useDeviceForMatch" : function(params: {modelId: string, matchId: string}){
		Utils.check(params.modelId, "string", "modelId");
		Utils.check(params.matchId, "string", "matchId");

		
		throw new Meteor.Error("501", "This method is not implemented yet!");
        
        // Please either return a value of type any or thow a new Meteor.Error in this method!
	}
});
