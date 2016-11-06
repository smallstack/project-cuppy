
/// <reference path="../generated/models/GeneratedCompetitionMatch.ts" />

class CompetitionMatch extends GeneratedCompetitionMatch {

	public static fromDocument(doc: any) {
		var model = super.fromDocument(doc);
		if (!(model.result instanceof Array))
			model.result = [];
		return model;
	}


	public getHomeTeamId(): string {
		return this.teamIds[0];
	}

	public getHomeTeam(): CompetitionTeam {
		var that = this;
		var teams: CompetitionTeam[] = this.getTeams().cursor.fetch();
		for (var t = 0; t < teams.length; t++) {
			if (teams[t].id == that.getHomeTeamId())
				return teams[t];
		};
		// console.log("home team not found!", this.getTeams().cursor.fetch());
		return undefined;
	}

	public getAwayTeamId(): string {
		return this.teamIds[1];
	}

	public getAwayTeam(): CompetitionTeam {
		var that = this;
		var teams: CompetitionTeam[] = this.getTeams().cursor.fetch();
		for (var t = 0; t < teams.length; t++) {
			if (teams[t].id == that.getAwayTeamId())
				return teams[t];
		};
		// console.log("away team not found!", this.getTeams().cursor.fetch());
		return undefined;
	}

	public updateScores(callback?: (error: Meteor.Error, result: boolean) => void): void {
		if (this.result instanceof Array && this.result[0] !== undefined && this.result[1] !== undefined) {
			if (callback === undefined)
				callback = function (error: Meteor.Error, result: any) {
					if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not save results of match!");
					else NotificationService.instance().notification.success("Updated results of match successfully!");
				}
			CompetitionMatchesService.instance().updateScores(this.id, this.result[0], this.result[1], callback);
		}
	}

	private isDateInThePast(date: Date) {
		if (date === undefined)
			return false;
		if (Meteor.isServer)
			return date.getTime() < new Date().getTime();
		else
			return date.getTime() < new Date(TimeSync.serverTime()).getTime();
	}

	public isFinished(): boolean {
		if (this.statusInternal === CompetitionMatch.enums.statusInternal.FINISHED)
			return true;
		return this.result instanceof Array && typeof this.result[0] === "number" && typeof this.result[1] === "number";
	}

	public isStarted(): boolean {
		if (this.statusInternal === CompetitionMatch.enums.statusInternal.STARTED)
			return true;
		if (this.statusInternal === undefined) {
			if (this.isDateInThePast(this.date))
				return true;
		}
		return false;
	}

	public isBetable(): boolean {
		return !this.isFinished() && !this.isStarted();
	}

	public isWinner(competitionTeamId: string): boolean {
		if (!this.isFinished())
			return false;
		if (this.result[0] > this.result[1] && competitionTeamId === this.getHomeTeamId())
			return true;
		if (this.result[0] < this.result[1] && competitionTeamId === this.getAwayTeamId())
			return true;
		return false;
	}

	public isLoser(competitionTeamId: string): boolean {
		if (!this.isFinished())
			return false;
		if (this.result[0] < this.result[1] && competitionTeamId === this.getHomeTeamId())
			return true;
		if (this.result[0] > this.result[1] && competitionTeamId === this.getAwayTeamId())
			return true;
		return false;
	}

	public isDrawn(): boolean {
		if (!this.isFinished())
			return false;
		return this.result[0] === this.result[1];
	}

	public getWinnerGoals(): number {
		if (!this.isFinished())
			return 0;
		if (this.isWinner(this.teamIds[0]))
			return this.result[0];
		else
			return this.result[1];
	}

	public getLoserGoals(): number {
		if (!this.isFinished())
			return 0;
		if (this.isLoser(this.teamIds[0]))
			return this.result[0];
		else
			return this.result[1];
	}

	public getDrawnGoals(): number {
		if (!this.isFinished())
			return 0;
		else
			return this.result[0];
	}
}
