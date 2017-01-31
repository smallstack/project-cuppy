/// <reference path="ICompetitionType.ts" />

class LeagueType implements ICompetitionType {

	public createRoundsAndMatches(competition: Competition) {

		let matchIndex: number = 0;

		// take care of wildcard team
		var teamCount = competition.teamIds.length;
		if (teamCount < 4)
			throw new Meteor.Error("501", "League competitions have to have at least 4 competition teams!");
		if ((teamCount % 2) !== 0)
			throw new Meteor.Error("501", "League competitions have to have an even count of teams!");

		var teams: number[] = _.range(0, teamCount);
		if (competition.randomizeTeams === true)
			teams = _.shuffle<number>(teams);
		var leagueDaysInTotal = teams.length - 1;

		if (competition.returnRound)
			leagueDaysInTotal *= 2;

		var leagueDays = [];

		for (var leagueDay = 0; leagueDay < leagueDaysInTotal; leagueDay++) {
			// create league days (competition groups)
			var leagueDayName = (leagueDay + 1) + ". Spieltag";

			var round: CompetitionRound = new CompetitionRound();
			round.competitionId = competition.id;
			round.index = leagueDay;
			round.name = Utils.createUrlConformIdFromInput(leagueDayName);
			round.multiplier = 1;
			round.id = CompetitionRoundsService.instance().saveCompetitionRound(round);
			competition.addRoundIds([round.id]);
			competition.update();

			leagueDays[leagueDay] = [];
			var teamsPlayed = [];

			if (this.isSecondHalfOfLeague(competition, leagueDay, leagueDaysInTotal))
				teams = teams.reverse();

			for (var m = 0; m < (teamCount - 2); m++) {

				// get a free team
				var freeTeam = _.find(teams, (index) => {
					return !_.contains(teamsPlayed, index);
				});
				teamsPlayed.push(freeTeam);

				// get a free opponent that the team hasn't played against yet
				var freeOpponent = _.find(teams, (index) => {
					if (_.contains(teamsPlayed, index))
						return false;

					// look for the combinations
					var combinationLeagueDayStart: number = 0;
					if (this.isSecondHalfOfLeague(competition, leagueDay, leagueDaysInTotal))
						combinationLeagueDayStart = (leagueDaysInTotal / 2);

					for (var i = combinationLeagueDayStart; i < leagueDays.length; i++) {
						for (var j = 0; j < leagueDays[i].length; j++) {
							if ((leagueDays[i][j].home == index && leagueDays[i][j].away == freeTeam) || (leagueDays[i][j].home == freeTeam && leagueDays[i][j].away == index))
								return false;
						}
					}
					return true;
				});
				teamsPlayed.push(freeOpponent);

				// create the match  
				if (freeTeam === undefined)
					throw new Error("Could not find free home team!");
				if (freeOpponent === undefined)
					throw new Error("Could not find free away team!");

				leagueDays[leagueDay].push({
					home: freeTeam,
					away: freeOpponent
				});


				var match: CompetitionMatch = new CompetitionMatch();
				match.competitionId = competition.id;
				if (this.isSecondHalfOfLeague(competition, leagueDay, leagueDaysInTotal))
					match.teamIds = [competition.teamIds[freeOpponent], competition.teamIds[freeTeam]];
				else
					match.teamIds = [competition.teamIds[freeTeam], competition.teamIds[freeOpponent]];
				match.roundId = round.id;
				match.index = matchIndex++;
				match.id = CompetitionMatchesService.instance().saveCompetitionMatch(match);

				round.matchIds.push(match.id);
				CompetitionRoundsService.instance().updateCompetitionRound(round);
			}
		}
	}

	private isSecondHalfOfLeague(competition: Competition, currentLeagueDay: number, leagueDaysInTotal: number): boolean {
		return competition.returnRound && currentLeagueDay >= (leagueDaysInTotal / 2);
	}
}
