/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"backoffice-manual-bet-update": function (matchId, userId, homeGoals, awayGoals) {
		Utils.check(matchId, String, "matchId");
		Utils.check(userId, String, "userId");
		Utils.check(homeGoals, Number, "homeGoals");
		Utils.check(awayGoals, Number, "awayGoals");

		if (!RolesService.instance().userHasRole(this.userId, "backoffice.manage"))
            throw new Meteor.Error("403", "You must be an administrator to update bets from other users!");

		var match: CompetitionMatch = CompetitionMatchesCollection.getMongoCollection().findOne(matchId);
		if (!match)
			throw new Meteor.Error("404", "Match could not be found!");

		var user: any = Meteor.users.findOne(userId);
		if (!user)
			throw new Meteor.Error("404", "User could not be found!");

		var availableBet: Bet = BetsService.instance().getBetsForMatchAndUserId({ matchId: matchId, userId: userId }).val(0);

		if (availableBet) {
			availableBet.result = [homeGoals, awayGoals];
			if (availableBet.update() !== 1)
				throw new Meteor.Error("501", "Could not update bet!");
		}

		var bet: Bet = new Bet();
		bet.competitionId = match.competitionId;
		bet.matchId = match.id;
		bet.result = [homeGoals, awayGoals];
		bet.ownerId = userId;
		BetsService.instance().saveBet(bet);

		// perform competition update
		var competition: Competition = match.getCompetition().val(0);
		var compService: ICompetitionService = competition.getCompetitionService();
		compService.updatePoints(match, true);
        compService.updateRanking(competition.id, compService.getRanking(competition.id));
	}
});