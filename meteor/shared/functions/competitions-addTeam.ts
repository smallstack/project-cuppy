/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server as well as on the client. On the client the simulation happens only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"competitions-addTeam": function(competitionId: string, teamId: string) {
		Utils.check(competitionId, String, "competitionId");
		Utils.check(teamId, String, "teamId");

		var competition: Competition = CompetitionsService.instance().getCompetitionById({ id: competitionId }).cursor.fetch()[0];
		if (competition === undefined)
			throw new Meteor.Error("404", "Competition with ID '" + competitionId + "' not found!");

		if (RolesService.instance().userHasRole(this.userId, Competition.roles.manage, competition)) {
			competition.teamIds.push(teamId);
			CompetitionsService.instance().updateCompetition(competition);
		}
		else
			throw new Meteor.Error("403", "You are not allowed to manage this competititon!")
	}
});