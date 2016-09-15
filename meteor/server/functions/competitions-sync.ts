/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-sync": function (params: { modelId: string }) {
		Utils.check(params.modelId, String, "modelId");

		var competition: Competition = CompetitionsCollection.getMongoCollection().findOne({
			_id: params.modelId
		});

		if (!competition)
			throw new Meteor.Error("404", "Could not find competition with id : " + params.modelId);

		if (competition.ownerId !== this.userId)
			throw new Meteor.Error("403", "You are not the owner of this competition!");

		if (competition.syncer !== undefined) {
			if (competition.syncer === Competition.enums.syncer.FOOTBALLDATA) {
				new FootballDataSyncer().updateCompetition(competition.id);
			}
			else
				throw new Meteor.Error("No suitable data syncer found!");
		}
		else
			throw new Meteor.Error("No metadata found on tournament!");
	}
});