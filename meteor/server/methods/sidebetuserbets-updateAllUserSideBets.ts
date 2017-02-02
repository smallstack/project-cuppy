import { Utils } from "smallstack";
import { SideBetUserBet } from "smallstack-datalayer";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"sidebetuserbets-updateAllUserSideBets": function (params: { mySidebets: SideBetUserBet[] }) {
		Utils.check(params.mySidebets, [SideBetUserBet.getSchema()], "mySidebets");


		throw new Meteor.Error("501", "This method is not implemented yet!");

		// Please either return a value of type any or thow a new Meteor.Error in this method!
	}
});
