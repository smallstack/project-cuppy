/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-resetScores": function (params: { modelId: string }) {
		Utils.check(params.modelId, String, "modelId");

		// check access
		var match: CompetitionMatch = CompetitionMatchesService.instance().getCompetitionMatchById({ id: params.modelId }).cursor.fetch()[0];
		if (match === undefined)
			throw new Meteor.Error("404", "Could not find match for updating scores [ID : " + params.modelId + "]!");
		var competition: Competition = CompetitionsService.instance().getCompetitionById({ id: match.competitionId }).cursor.fetch()[0];
		if (competition === undefined)
			throw new Meteor.Error("404", "Could not find competition with id '" + match.competitionId + "' while updating scores!");
		if (competition.ownerId !== this.userId)
			throw new Meteor.Error("403", "You can only update scores from competitions you own!");

		match.result = [];
		if (match.update() !== 1)
			throw new Meteor.Error("403", "Could not reset scores on match!");

		// reset bet points
		BetsCollection.getMongoCollection().update({
			matchId: match.id
		}, {
				$unset: {
					points: 0
				}
			});

		// re-calculate ranking
		var compService: ICompetitionService = competition.getCompetitionService();
		compService.updatePoints(match, true);
        compService.updateRanking(competition.id, compService.getRanking(competition.id));
	}
});