/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionRounds-updateRoundDetails": function (params: { modelId: string, roundName: string, multiplier: number, index: number }) {
		Utils.check(params.modelId, String, "modelId");
		Utils.check(params.roundName, String, "roundName");
		Utils.check(params.multiplier, Number, "multiplier");
		Utils.check(params.index, Number, "index");


		var round: CompetitionRound = CompetitionRoundsCollection.getMongoCollection().findOne(params.modelId);
		if (!round)
			throw new Meteor.Error("404", "Could not find round with id : " + params.modelId);


		var competition: Competition = CompetitionsCollection.getMongoCollection().findOne({
			_id: round.competitionId
		});

		if (!competition)
			throw new Meteor.Error("404", "Could not find related competition with id : " + round.competitionId);

		if (competition.ownerId !== this.userId)
			throw new Meteor.Error("403", "You are not the owner of the related competition, so you cannot update rounds!");

		var updated: number = CompetitionRoundsCollection.getMongoCollection().update(round.id, {
			$set: {
				multiplier: params.multiplier,
				name: params.roundName,
				index: params.index
			}
		});

		// update maxPoints
		CompetitionMatchesCollection.getMongoCollection().update({ roundId: round.id }, { $set: { maxPoints: (params.multiplier * 3) } }, {
			multi: true
		});

		if (updated !== 1)
			throw new Meteor.Error("501", "Could not update competition round!");


		return true;
	}
});