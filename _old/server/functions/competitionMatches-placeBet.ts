/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitionMatches-placeBet": function (params: { modelId: string, homeGoals: number, awayGoals: number }) {
		Utils.check(params.modelId, String, "modelId");
		Utils.check(params.homeGoals, Number, "homeGoals");
		Utils.check(params.awayGoals, Number, "awayGoals");

		var userId: string = this.userId;

		if (!userId)
			throw new Meteor.Error("403", "You must be logged in to place a bet! userId: [" + userId + "]");

		var match: CompetitionMatch = CompetitionMatchesCollection.getMongoCollection().findOne(params.modelId);
		if (!match)
			throw new Meteor.Error("404", "Match could not be found!");

		// TODO: check match -> competition access rights when competition went private

		if (!match.isBetable())
			throw new Meteor.Error("501", "You cannot place a bet on this match!");

		var availableBet: Bet = BetsService.instance().getBetsForMatchAndUserId({ matchId: params.modelId, userId: userId }).val(0);

		if (availableBet) {
			availableBet.result = [params.homeGoals, params.awayGoals];
			if (availableBet.update() !== 1)
				throw new Meteor.Error("501", "Could not update bet!");
			return availableBet.id;
		}

		var bet: Bet = new Bet();
		bet.competitionId = match.competitionId;
		bet.matchId = match.id;
		bet.result = [params.homeGoals, params.awayGoals];
		bet.ownerId = userId;
		return BetsService.instance().saveBet(bet);
	}
});