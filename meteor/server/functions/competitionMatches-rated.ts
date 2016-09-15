/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-rated": function (params: { modelId: string }) {
		Utils.check(params.modelId, String, "modelId");

		var userId: string = this.userId;

		if (!userId)
			throw new Meteor.Error("403", "You must be logged in to rate");

		CompetitionMatchesCollection.getMongoCollection().update(params.modelId, {
			$addToSet: {
				ratedByIds: userId
			}
		});

		return true;
	}
});