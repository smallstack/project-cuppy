import { Autowired } from "@smallstack/core-common";
import { CompetitionsCollection } from "@smallstack/datalayer";
import { Bet } from "@smallstack/datalayer";
import { CompetitionRound } from "@smallstack/datalayer";
import { CompetitionMatch } from "@smallstack/datalayer";
import { BetsService } from "@smallstack/datalayer";
import * as _ from "underscore";
import { CompetitionRank, IScoreStrategy } from "./IScoreStrategy";

export class Football3210ScoreStrategy implements IScoreStrategy {

    @Autowired()
    private betsService: BetsService;

    public updatePoints(match: CompetitionMatch, force: boolean = false) {
        if (!match.isFinished() && !force)
            return;

        const round: CompetitionRound = match.getRound().getModels()[0];
        const multiplier: number = round.betMultiplier ? round.betMultiplier : 1;

        const bets: Bet[] = this.betsService.getBetsForMatchId({ matchId: match.id }).getModels();
        _.each<Bet>(bets, (bet: Bet) => {
            bet.points = this.getPoints(match, bet, multiplier);
            bet.update();
        });
    }

    public getPoints(match: CompetitionMatch, bet: Bet, multiplier: number = 1) {
        if (!match || !match.isFinished())
            return 0;

        if (bet === undefined)
            return 0;

        let points: number = 0;

        // calculate points
        if (match.result[0] === bet.result[0] && match.result[1] === bet.result[1])
            points = 3;
        else if ((match.result[0] - match.result[1]) === (bet.result[0] - bet.result[1]))
            points = 2;
        else if (this.winnerIndex(match.result) === this.winnerIndex(bet.result))
            points = 1;

        return points * multiplier;
    }

    public updateMatchResult(match: CompetitionMatch, results: number[], updatePoints: boolean = true, updateRanking: boolean = true, updateRound: boolean = true) {
        match.result = results;
        if (match.update() !== 1)
            throw new Error("Scores could not be updated!");
        if (updatePoints)
            this.updatePoints(match);
        if (updateRanking)
            this.updateRanking(match.competitionId, this.getRanking(match.competitionId));
        if (updateRound) {
            this.updateRound(match.getRound().getModel(0));
        }
    }

    public updateRound(round: CompetitionRound) {
        let allMatchesFinished: boolean = true;
        round.getMatches().getModels().forEach((match: CompetitionMatch) => {
            if (!match.isFinished())
                allMatchesFinished = false;
        });

        round.allMatchesFinished = allMatchesFinished;
        round.update();
    }

    // public updateSideBetPoints(sideBetId: string) {
    // var sideBet: SideBet = SidebetsCollection.getCollection().findOne(sideBetId);
    //     if (!sideBet)
    //         throw new Error("Could not find sidebet with id : " + sideBetId);

    //     // update user sidebets
    //     SidebetuserbetsCollection.getCollection().find({ sideBetId: sideBetId }).forEach((sideBetUserBet: SideBetUserBet) => {
    //         // compare result
    //         var points: number = 0;
    //         if (sideBet.result === sideBetUserBet.result)
    //             points = sideBet.points;
    //         SidebetuserbetsCollection.getCollection().update(sideBetUserBet.id, { $set: { points: points } });
    //     });

    //     this.updateRanking(sideBet.competitionId, this.getRanking(sideBet.competitionId));
    // }

    public updateRanking(competitionId: string, ranking: CompetitionRank[]) {
        if (CompetitionsCollection.getCollection().update(competitionId, { $set: { ranking } }) !== 1)
            throw new Error("Could not update competition ranking cause it wasn't found!");
    }


    public getRanking(competitionId: string): CompetitionRank[] {
        const groupedByUser: { [userId: string]: number } = {};

        // bets
        this.betsService.getBetsForCompetitionId({ competitionId }).getModels().forEach((bet: Bet, index: number) => {
            if (_.isNumber(bet.points)) {
                if (groupedByUser[bet.ownerId] === undefined)
                    groupedByUser[bet.ownerId] = 0;
                groupedByUser[bet.ownerId] += bet.points;
            }
        });

        // sidebets
        // this.sidebetuserbetsService.getForCompetitionId({ competitionId: competitionId }).cursor.forEach((sideBetUserBet: SideBetUserBet, index: number, cursor: Mongo.Cursor<SideBetUserBet>) => {
        //     if (_.isNumber(sideBetUserBet.points)) {
        //         if (groupedByUser[sideBetUserBet.ownerId] === undefined)
        //             groupedByUser[sideBetUserBet.ownerId] = 0;
        //         groupedByUser[sideBetUserBet.ownerId] += sideBetUserBet.points;
        //     }
        // });

        // create ranking entries
        const ranking: CompetitionRank[] = [];
        _.each(groupedByUser, (entry: number, userId: string) => {
            ranking.push({ points: entry, userId, rank: 0 });
        });

        // sort
        ranking.sort((a: CompetitionRank, b: CompetitionRank) => {
            if (a.points > b.points)
                return -1;
            if (a.points < b.points)
                return 1;
            return 0;
        });

        // add rank
        let currentRank = 1;
        const pointsRank = [];
        _.each(ranking, (rank: CompetitionRank) => {
            if (pointsRank[rank.points] !== undefined)
                rank.rank = pointsRank[rank.points];
            else {
                rank.rank = currentRank;
                pointsRank[rank.points] = currentRank;
            }
            currentRank++;
        });
        return ranking;
    }

    private winnerIndex(matchOrBetResult: number[]) {
        if (matchOrBetResult[0] === matchOrBetResult[1])
            return undefined;

        if (matchOrBetResult[0] > matchOrBetResult[1])
            return 0;
        return 1;
    }

}
