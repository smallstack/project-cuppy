/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-updateCompetitionViaMethod": function (params: { modelId: string, competition: any }) {
		Utils.check(params.modelId, String, "modelId");

		// check if competition exists
		if (params.modelId !== params.competition._id)
			throw new Meteor.Error("400", "Competition IDs don't match!");
		let competition: Competition = CompetitionsCollection.getMongoCollection().findOne(params.competition._id);
		if (!competition)
			throw new Meteor.Error("404", "Competition could not be found!");
		if (!competition.isAdministrator(this.userId))
			throw new Meteor.Error("403", "You must be an administrator to update this competition!");

		competition = Competition.fromDocument(params.competition);

		// do some basic checks
		if (!competition.isAdministrator(competition.ownerId))
			throw new Meteor.Error("400", "The owner cannot be removed from the administrators!");

		return competition.update() === 1;
	}
});
