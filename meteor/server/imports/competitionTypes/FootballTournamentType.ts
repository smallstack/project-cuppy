import { Utils } from "@smallstack/core-common";
import { Competition, CompetitionMatch, CompetitionMatchesService, CompetitionRound, CompetitionRoundsService, CompetitionsService } from "@smallstack/datalayer";
import * as _ from "underscore";
import { ICompetitionType } from "./ICompetitionType";


export class FootballTournamentType implements ICompetitionType {

    public createRoundsAndMatches(competition: Competition) {

        let matchIndex: number = 0;

        const competitionsService: CompetitionsService = CompetitionsService.instance();

        // take care of wildcard team
        let teamCount: number = competition.teamIds.length;
        if (teamCount < 4)
            throw new Meteor.Error("501", "Tournament competitions have to have at least 3 competition teams!");
        const wildcardCount = competitionsService.getTournamentWildcardCount(teamCount);
        if (wildcardCount !== 0)
            teamCount += wildcardCount;

        let teams = _.range(0, teamCount);

        if (competition.randomizeTeams === true)
            teams = _.shuffle<number>(teams);

        const leagueDaysInTotal = competitionsService.getTournamentRounds(teamCount);
        let currentRoundGamesCount = teams.length / 2;

        for (let leagueDay = 0; leagueDay < leagueDaysInTotal; leagueDay++) {
            const leagueDayName = competitionsService.getTournamentRoundName(leagueDay, leagueDaysInTotal);

            // create league days (competition groups)
            const round: CompetitionRound = new CompetitionRound();
            round.name = Utils.createUrlConformIdFromInput(leagueDayName);
            round.betMultiplier = 1;
            round.competitionId = competition.id;
            round.id = CompetitionRoundsService.instance().save(round);
            competition.roundIds.push(round.id);
            competition.update();

            // special case for day one (all teams are playing)
            if (leagueDay === 0) {
                const teamsPlayed = [];
                for (let m = 0; m < currentRoundGamesCount; m++) {

                    if (competition.randomizeTeams === true)
                        teams = _.shuffle<number>(teams);

                    // get 2 free teams
                    const teamA = _.find(teams, (index) => {
                        // return unplayed and non-wildcard player
                        return !_.contains(teamsPlayed, index) && competition.teamIds[index] !== undefined;
                    });
                    teamsPlayed.push(teamA);
                    const teamB = _.find(teams, (index) => {
                        // return wildcard if possible
                        if (teamsPlayed.length <= wildcardCount * 2)
                            return !_.contains(teamsPlayed, index) && competition.teamIds[index] === undefined;
                        return !_.contains(teamsPlayed, index);
                    });
                    teamsPlayed.push(teamB);

                    // create the match
                    if (competition.teamIds[teamA] === undefined || competition.teamIds[teamB] === undefined) {

                        const goalsA = competition.teamIds[teamA] === undefined ? 0 : 1;
                        const goalsB = competition.teamIds[teamB] === undefined ? 0 : 1;

                        // insert wildcard match
                        const match: CompetitionMatch = new CompetitionMatch();
                        match.competitionId = competition.id;
                        match.teamIds = [competition.teamIds[teamA], competition.teamIds[teamB]];
                        match.index = matchIndex++;
                        match.roundId = round.id;
                        match.result = [goalsA, goalsB];
                        match.id = CompetitionMatchesService.instance().save(match);
                        round.matchIds.push(match.id);
                        round.update();
                    } else {
                        const match: CompetitionMatch = new CompetitionMatch();
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
            // 	for (let i = 0; i < currentRoundGamesCount; i++) {
            // 		// create the match
            // 		let match: CompetitionMatch = new CompetitionMatch();
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
