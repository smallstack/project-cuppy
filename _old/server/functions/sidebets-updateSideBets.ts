/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"sidebets-updateSideBets": function (params: { sidebets: SideBet[] }) {

		if (!(params.sidebets instanceof Array))
			throw new Meteor.Error("501", "Parameter is not an array of sidebets!");

		var collection: Mongo.Collection<SideBet> = SidebetsCollection.getMongoCollection();

		_.each(params.sidebets, (sideBet: SideBet) => {

			// check access rights
			var competition: Competition = CompetitionsService.instance().getCompetitionById({ id: sideBet.competitionId }).val(0);
			if (!competition)
				throw new Meteor.Error("404", "Competition for SideBet not found!");
			if (!competition.isAdministrator(this.userId))
				throw new Meteor.Error("403", "You are not an administrator of this competition!");

			// have a look if sidebet already exists
			if (sideBet.id) {
				collection.update(sideBet.id, {
					$set: {
						question: sideBet.question,
						result: sideBet.result,
						resultType: sideBet.resultType,
						endDate: sideBet.endDate,
						points: sideBet.points
					}
				});
			}
			else {
				SidebetsService.instance().saveSideBet(SideBet.fromDocument(sideBet));
			}

			// if result is set -> evaluate
			if (sideBet.result !== undefined) {
				competition.getCompetitionService().updateSideBetPoints(sideBet.id);
			}
		});
	}
});
