/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-createCompetition": function (params: { competitionName: string, competitionType: string }) {
		Utils.check(params.competitionName, String, "competitionName");
		Utils.check(params.competitionType, String, "competitionType");

		if (this.userId === null)
			throw new Meteor.Error("You have to be logged in to be able to create a new competition!");
		if (!Match.test(params.competitionName, String))
			throw new Meteor.Error("Competition Name must be a string!");
		if (params.competitionName.length < 3)
			throw new Meteor.Error("Competition Name must be at least 3 characters long!");
		if (!_.contains(_.toArray(Competition.enums.type), params.competitionType))
			throw new Meteor.Error("Unknown Competition Type '" + params.competitionType + "'!");

		// find a suitable ID
		var id = Utils.createUrlConformIdFromInput(params.competitionName);
		var randomHash = "";
		do {
			var count: number = CompetitionsCollection.getMongoCollection().find({
				name: id + randomHash
			}).count();
			if (count !== 0)
				randomHash = new Chance().word();
		} while (count !== 0);
		var competitionId = id + randomHash;

		// create the competition
		var competition: Competition = new Competition();
		competition.name = competitionId;
		competition.displayName = params.competitionName;
		competition.type = params.competitionType;
		competition.ownerId = this.userId;
		competition.userIds = [this.userId];
		competition.administratorIds = [this.userId];
		competition.createdAt = new Date();

		var savedCompetitionId = CompetitionsService.instance().saveCompetition(competition);

		return CompetitionsCollection.getMongoCollection().findOne(savedCompetitionId);
	}
});
