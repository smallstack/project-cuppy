/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"sidebetuserbets-updateAllUserSideBets": function (params: { mySidebets: SideBetUserBet[] }) {

		if (!(params.mySidebets instanceof Array))
			throw new Meteor.Error("501", "Parameter is not an array of mySidebets!");

		var collection: Mongo.Collection<SideBetUserBet> = SidebetuserbetsCollection.getMongoCollection();

        _.each(params.mySidebets, (userSideBet: SideBetUserBet) => {

			// check access rights ??????
			// var competition: Competition = CompetitionsService.instance().getCompetitionById({ id: sideBet.competitionId }).val(0);
			// if (!competition)
			// 	throw new Meteor.Error("404", "Competition for SideBet not found!");
			// if (!competition.ownerId === this.userId)
			// 	throw new Meteor.Error("403", "You are not the owner of the sidebet's competition!");

			// check enddate
			var sidebet: SideBet = SidebetsService.instance().getSideBetById({ id: userSideBet.sideBetId }).val(0);
			if (sidebet.endDate.getTime() < new Date().getTime()) {
				throw new Meteor.Error("403", "The end date of this sidebet as been reached already, sorry!");
			}

			// have a look if sidebet already exists
			if (userSideBet.id) {
				if (userSideBet.ownerId !== this.userId)
					throw new Meteor.Error("403", "You are not the owner of your own Sidebet!");
				collection.update(userSideBet.id, {
					$set: {
						result: userSideBet.result
					}
				});
			}
			else {
				delete userSideBet.points; // hehe, just in case
				SidebetuserbetsService.instance().saveSideBetUserBet(SideBetUserBet.fromDocument(userSideBet));
			}
		});
	}
});