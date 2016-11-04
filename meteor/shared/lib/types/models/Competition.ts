
/// <reference path="../generated/models/GeneratedCompetition.ts" />

class Competition extends GeneratedCompetition {

	private competitionsService: CompetitionsService = CompetitionsService.instance();

	// public triggerTournamentUpdate() {
	// 	CompetitionsService.instance().triggerTournamentUpdate(this.id, function (error: Meteor.Error, result: any) {
	// 		if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not trigger tournament update!");
	// 	});
	// }

	public getWildcards() {
		if (this.type === Competition.enums.type.LEAGUE)
			return this.teamIds.length % 2;
		if (this.type === Competition.enums.type.TOURNAMENT)
			return this.competitionsService.getTournamentWildcardCount(this.teamIds.length);
	}

	public startCompetition() {
		this.competitionsService.startCompetition(this.id, function (error: Meteor.Error, result: boolean) {
			if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not start competition!");
			else NotificationService.instance().notification.success("Competition started!");
		});
	}

	public restartCompetition() {
		var that = this;
		NotificationService.instance().popup.confirmation("Do you really want to restart the competition? All matches, bets etc. will be lost!", function (answer: boolean) {
			if (answer) {
				that.competitionsService.startCompetition(that.id, function (error: Meteor.Error, result: boolean) {
					if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not start competition!");
					else NotificationService.instance().notification.success("Competition started!");
				});
			}
		});
	}

	public addTeam(team: CompetitionTeam) {
		var that = this;
		if (this.started) {
			if (this.type !== Competition.enums.type.LEAGUE)
				NotificationService.instance().popup.error("After a competition is started, you can only add teams to league competitions!");
			else {
				NotificationService.instance().popup.confirmation("The competition is already started, do you really want to add team '" + team.name + "'?", function (answer: boolean) {
					if (answer)
						CompetitionsService.instance().addTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not add Team!", "Successfully added Team!"));
				});
			}
		}
		else
			CompetitionsService.instance().addTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not add Team!", "Successfully added Team!"));
	}

	public removeTeam(team: CompetitionTeam) {
		var that = this;
		if (this.started) {
			if (this.type !== Competition.enums.type.LEAGUE)
				NotificationService.instance().popup.error("After a competition is started, you can only remove teams from league competitions!");
			else {
				NotificationService.instance().popup.confirmation("The competition is already started, do you really want to remove team '" + team.name + "'? This would result in deleting all matches that the team has already played!", function (answer: boolean) {
					if (answer)
						CompetitionsService.instance().removeTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not remove Team!", "Successfully removed Team!"));

				});
			}
		}
		else
			CompetitionsService.instance().removeTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not remove Team!", "Successfully removed Team!"));
	}

	public getCompetitionService(): ICompetitionService {
		if (Meteor.isClient)
			throw new Error("CompetitionsServices are only available on the server!");

		switch (this.type) {
			case Competition.enums.type.TOURNAMENT:
				return new DefaultCompetitionService();
			case Competition.enums.type.LEAGUE:
				return new DefaultCompetitionService();
		}
	}

	public isAdministrator(userId: string): boolean {
		return this.administratorIds.indexOf(userId) !== -1;
	}

}
