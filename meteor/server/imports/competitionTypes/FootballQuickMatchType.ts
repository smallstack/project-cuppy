import { Utils } from "@smallstack/core-common";
import { Competition, CompetitionMatch, CompetitionMatchesService, CompetitionRound, CompetitionRoundsService } from "@smallstack/datalayer";
import { ICompetitionType } from "./ICompetitionType";

export class FootballQuickMatchType implements ICompetitionType {

    public createRoundsAndMatches(competition: Competition) {

        const teamCount: number = competition.teamIds.length;
        if (teamCount !== 2)
            throw new Meteor.Error("501", "A Quick Match has to have exactly 2 competition teams!");

        // hinspiel
        const round: CompetitionRound = new CompetitionRound();
        round.name = Utils.createUrlConformIdFromInput("first round");
        round.betMultiplier = 1;
        round.competitionId = competition.id;
        round.id = CompetitionRoundsService.instance().save(round);
        competition.roundIds.push(round.id);
        competition.update();

        const match: CompetitionMatch = new CompetitionMatch();
        match.competitionId = competition.id;
        match.teamIds = [competition.teamIds[0], competition.teamIds[1]];
        match.roundId = round.id;
        match.index = 0;
        match.id = CompetitionMatchesService.instance().save(match);
        round.matchIds.push(match.id);
        CompetitionRoundsService.instance().update(round);

        // rückspiel
        if (competition.returnRound) {
            const secondRound: CompetitionRound = new CompetitionRound();
            secondRound.name = Utils.createUrlConformIdFromInput("second round");
            secondRound.betMultiplier = 1;
            secondRound.competitionId = competition.id;
            secondRound.id = CompetitionRoundsService.instance().save(secondRound);
            competition.roundIds.push(secondRound.id);
            competition.update();

            const returnMatch: CompetitionMatch = new CompetitionMatch();
            returnMatch.competitionId = competition.id;
            returnMatch.teamIds = [competition.teamIds[1], competition.teamIds[0]];
            returnMatch.roundId = secondRound.id;
            returnMatch.index = 1;
            returnMatch.id = CompetitionMatchesService.instance().save(returnMatch);
            secondRound.matchIds.push(returnMatch.id);
            CompetitionRoundsService.instance().update(secondRound);
        }

    }
}
