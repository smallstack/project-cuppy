import { Utils } from "smallstack";
import { SideBet } from "smallstack-datalayer";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"sidebets-updateSideBets": function (params: { sidebets: SideBet[] }) {
		Utils.check(params.sidebets, [SideBet.getSchema()], "sidebets");


		throw new Meteor.Error("501", "This method is not implemented yet!");

		// Please either return a value of type any or thow a new Meteor.Error in this method!
	}
});
