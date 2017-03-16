import { ICompetitionType } from "./ICompetitionType";
import { Competition, CompetitionRound, CompetitionsService, CompetitionRoundsService, CompetitionMatch, CompetitionMatchesService } from "@smallstack/datalayer";
import { Utils } from "@smallstack/core-common";
import * as _ from "underscore";


export class TournamentType implements ICompetitionType {

    public createRoundsAndMatches(competition: Competition) {

        let matchIndex: number = 0;

        var competitionsService: CompetitionsService = CompetitionsService.instance();

        // take care of wildcard team
        var teamCount: number = competition.teamIds.length;
        if (teamCount < 4)
            throw new Meteor.Error("501", "Tournament competitions have to have at least 3 competition teams!");
        var wildcardCount = competitionsService.getTournamentWildcardCount(teamCount);
        if (wildcardCount !== 0)
            teamCount += wildcardCount;

        var teams = _.range(0, teamCount);

        if (competition.randomizeTeams === true)
            teams = _.shuffle<number>(teams);

        var leagueDaysInTotal = competitionsService.getTournamentRounds(teamCount);
        var currentRoundGamesCount = teams.length / 2;

        console.log(teams);

        for (var leagueDay = 0; leagueDay < leagueDaysInTotal; leagueDay++) {
            var leagueDayName = competitionsService.getTournamentRoundName(leagueDay, leagueDaysInTotal);
            var orderId = 0;

            // create league days (competition groups)
            var round: CompetitionRound = new CompetitionRound();
            round.name = Utils.createUrlConformIdFromInput(leagueDayName);
            round.multiplier = 1;
            round.competitionId = competition.id;
            round.id = CompetitionRoundsService.instance().save(round);
            competition.roundIds.push(round.id);
            competition.update();

            // special case for day one (all teams are playing)
            if (leagueDay === 0) {
                var teamsPlayed = [];
                for (var m = 0; m < currentRoundGamesCount; m++) {

                    if (competition.randomizeTeams === true)
                        teams = _.shuffle<number>(teams);

                    // get 2 free teams
                    var teamA = _.find(teams, function (index) {
                        // return unplayed and non-wildcard player
                        return !_.contains(teamsPlayed, index) && competition.teamIds[index] !== undefined;
                    });
                    teamsPlayed.push(teamA);
                    var teamB = _.find(teams, function (index) {
                        // return wildcard if possible
                        if (teamsPlayed.length <= wildcardCount * 2)
                            return !_.contains(teamsPlayed, index) && competition.teamIds[index] === undefined;
                        return !_.contains(teamsPlayed, index);
                    });
                    teamsPlayed.push(teamB);

                    // create the match
                    if (competition.teamIds[teamA] === undefined || competition.teamIds[teamB] === undefined) {

                        var goalsA = competition.teamIds[teamA] === undefined ? 0 : 1;
                        var goalsB = competition.teamIds[teamB] === undefined ? 0 : 1;

                        // insert wildcard match
                        var match: CompetitionMatch = new CompetitionMatch();
                        match.competitionId = competition.id;
                        match.teamIds = [competition.teamIds[teamA], competition.teamIds[teamB]];
                        match.index = matchIndex++;
                        match.roundId = round.id;
                        match.result = [goalsA, goalsB];
                        match.id = CompetitionMatchesService.instance().save(match);
                        round.matchIds.push(match.id);
                        round.update();
                    } else {
                        var match: CompetitionMatch = new CompetitionMatch();
                        match.competitionId = competition.id;
                        match.teamIds = [competition.teamIds[teamA], competition.teamIds[teamB]];
                        match.index = matchIndex++;
                        match.roundId = round.id;
                        match.id = CompetitionMatchesService.instance().save(match);
                        round.matchIds.push(match.id);
                        round.update();
                    }
                }
            }

            // other days can be prefilled with empty teams here (to be able to bet on them already and to see the tourmanemt tree)
            // else {
            // 	for (var i = 0; i < currentRoundGamesCount; i++) {
            // 		// create the match
            // 		var match: CompetitionMatch = new CompetitionMatch();
            // 		match.competitionId = competition.id;
            // 		match.index = orderId++;
            // 		match.roundId = round.id;
            // 		match.id = CompetitionMatchesService.instance().s(match);
            // 		round.matchIds.push(match.id);
            // 		round.update();
            // 	}
            // }

            currentRoundGamesCount /= 2;
        }
    }
}
