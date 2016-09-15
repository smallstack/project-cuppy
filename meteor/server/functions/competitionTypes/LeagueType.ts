/// <reference path="ICompetitionType.ts" />

class LeagueType implements ICompetitionType {

	public createRoundsAndMatches(competition: Competition) {

		
		// take care of wildcard team
		var teamCount = competition.teamIds.length;
		if ((teamCount % 2) !== 0)
			teamCount++;

		var teams: number[] = _.range(0, teamCount);
		var leagueDaysInTotal = teams.length - 1;

		console.log(teams);

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

			for (var m = 0; m < (leagueDaysInTotal / 2); m++) {
				if (competition.randomizeTeams === true)
					teams = _.shuffle<number>(teams);

				// get a free team
				var freeTeam = _.find(teams, function(index) {
					return !_.contains(teamsPlayed, index);
				});
				teamsPlayed.push(freeTeam);

				// get a free opponent that the team hasn't played against yet
				var freeOpponent = _.find(teams, function(index) {
					if (_.contains(teamsPlayed, index))
						return false;

					for (var i = 0; i < leagueDays.length; i++) {
						for (var j = 0; j < leagueDays[i].length; j++) {
							if ((leagueDays[i][j].home == index && leagueDays[i][j].away == freeTeam) || (leagueDays[i][j].home == freeTeam && leagueDays[i][j].away == index))
								return false;
						}
					}
					return true;
				});
				teamsPlayed.push(freeOpponent);

				// create the match        
				leagueDays[leagueDay].push({
					home: freeTeam,
					away: freeOpponent
				});

				var match: CompetitionMatch = new CompetitionMatch();
				match.competitionId = competition.id;
				match.teamIds = [competition.teamIds[freeTeam], competition.teamIds[freeOpponent]];
				match.roundId = round.id;
				match.index = m;
				match.id = CompetitionMatchesService.instance().saveCompetitionMatch(match);

				round.matchIds.push(match.id);
				CompetitionRoundsService.instance().updateCompetitionRound(round);
			}
		}
	}
}