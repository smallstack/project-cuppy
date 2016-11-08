/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"devices-useDeviceForMatch": function (params: { modelId: string, matchId: string }) {
		Utils.check(params.modelId, String, "modelId");
		Utils.check(params.matchId, String, "matchId");

		if (!this.userId)
			throw new Meteor.Error("403", "User is not logged in!");

		let device: Device = DevicesCollection.getMongoCollection().findOne({ _id: params.modelId, ownerId: this.userId });
		if (!device)
			throw new Meteor.Error("404", "Device not found!");

		// check match access
		let match: CompetitionMatch = CompetitionMatchesCollection.getMongoCollection().findOne(params.matchId);
		if (!match)
			throw new Meteor.Error("404", "Match not found!");
		let competition: Competition = match.getCompetition().val(0);
		if (!competition.isAdministrator(this.userId))
			throw new Meteor.Error("403", "You have to be an administrator of the related competition to use a device for tracking the score of this match!");

		device.matchId = params.matchId;
		device.update();
	}
});
