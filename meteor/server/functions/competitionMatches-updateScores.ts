/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-updateScores": function (params: { matchId: string, resultHome: number, resultAway: number }) {
		Utils.check(params.matchId, String, "matchId");
		Utils.check(params.resultHome, Number, "resultHome");
		Utils.check(params.resultAway, Number, "resultAway");

		// check access
		var match: CompetitionMatch = CompetitionMatchesService.instance().getCompetitionMatchById({ id: params.matchId }).cursor.fetch()[0];
		if (match === undefined)
			throw new Meteor.Error("404", "Could not find match for updating scores [ID : " + params.matchId + "]!");
		var competition: Competition = CompetitionsService.instance().getCompetitionById({ id: match.competitionId }).cursor.fetch()[0];
		if (competition === undefined)
			throw new Meteor.Error("404", "Could not find competition with id '" + match.competitionId + "' while updating scores!");
		if (competition.ownerId !== this.userId)
			throw new Meteor.Error("403", "You can only update scores from competitions you own!");


		competition.getCompetitionService().updateMatchResult(match, [params.resultHome, params.resultAway], true, true, true);
		match.manuallyUpdated = true;
		match.update();

		return true;

	}
});